from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Optional, Annotated
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator, EmailStr

from seed_data import META_ADS_DECODE_PRODUCT, CATEGORIES, SITE_SETTINGS, TESTIMONIALS, AI_IDEAS_PRODUCT, PROMPT_GUIDE_PRODUCT, BUNDLE_PRODUCT

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Decode Storefront API")
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="allow")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        doc = self.model_dump(by_alias=True, exclude_none=True)
        doc.pop("_id", None)
        return doc

    @classmethod
    def from_mongo(cls, doc):
        if not doc:
            return None
        return cls(**doc)


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    order_id: Optional[str] = None
    topic: str
    message: str


class ContactMessage(ContactIn, BaseDocument):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    product_slug: str
    edition: str = "digital"
    email: Optional[EmailStr] = None


class Order(BaseDocument):
    order_id: str = Field(default_factory=lambda: f"ORD-{uuid.uuid4().hex[:10].upper()}")
    product_slug: str
    product_title: str = ""
    edition: str = "digital"
    amount: Optional[float] = None
    currency: str = "INR"
    email: Optional[str] = None
    status: str = "payment_pending"
    payment_provider: str = "external"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    model_config = ConfigDict(extra="allow")
    title: str
    slug: str
    category: str = "guides"
    tagline: str = ""
    description: str = ""
    regular_price: Optional[float] = None
    sale_price: Optional[float] = None
    featured: bool = False
    is_new: bool = True
    checkout_url: str = ""


def serialize_doc(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"key": "site"})
    return serialize_doc(settings) if settings else SITE_SETTINGS


@api_router.get("/categories")
async def get_categories():
    cats = await db.categories.find({}).to_list(100)
    return [serialize_doc(c) for c in cats]


@api_router.get("/products")
async def list_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    sort: Optional[str] = "featured",
    featured: Optional[bool] = None,
):
    query: dict = {"status": "published"}
    if category and category != "all":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"tagline": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    products = await db.products.find(query).to_list(200)

    def price_of(p):
        edition_price = (p.get("editions") or {}).get("digital", {}).get("price")
        return p.get("sale_price") or edition_price or p.get("regular_price") or 0

    if sort == "price_asc":
        products.sort(key=price_of)
    elif sort == "price_desc":
        products.sort(key=price_of, reverse=True)
    elif sort == "newest":
        products.sort(key=lambda p: str(p.get("created_at", "")), reverse=True)
    else:
        products.sort(key=lambda p: (not p.get("featured", False), str(p.get("created_at", ""))))
    return [serialize_doc(p) for p in products]


@api_router.get("/products/{slug}")
async def get_product(slug: str):
    product = await db.products.find_one({"slug": slug, "status": "published"})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_doc(product)


@api_router.get("/testimonials")
async def list_testimonials(product_slug: Optional[str] = None):
    query = {"product_slug": product_slug} if product_slug else {}
    items = await db.testimonials.find(query).to_list(100)
    return [serialize_doc(t) for t in items]


@api_router.post("/contact")
async def create_contact(payload: ContactIn):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.to_mongo())
    return {"ok": True, "message": "Your message has been received. We will get back to you soon."}


@api_router.post("/orders")
async def create_order(payload: OrderCreate):
    product = await db.products.find_one({"slug": payload.product_slug, "status": "published"})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    edition = (product.get("editions") or {}).get(payload.edition)
    if not edition:
        raise HTTPException(status_code=400, detail="Unknown edition")
    order = Order(
        product_slug=product["slug"],
        product_title=product["title"],
        edition=payload.edition,
        amount=edition.get("price"),
        currency=product.get("currency", "INR"),
        email=str(payload.email) if payload.email else None,
    )
    await db.orders.insert_one(order.to_mongo())
    checkout_url = edition.get("checkout_url") or product.get("checkout_url") or ""
    return {"order_id": order.order_id, "checkout_url": checkout_url, "amount": order.amount, "currency": order.currency}


@api_router.get("/orders/recent-summary")
async def recent_orders_summary():
    """Genuine paid-order count only. Powers the recent-purchase notice; hidden when zero."""
    since = datetime.now(timezone.utc) - timedelta(days=7)
    count = await db.orders.count_documents({"status": "paid", "created_at": {"$gte": since}})
    return {"paid_orders_last_7_days": count}


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"order_id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order = serialize_doc(order)
    order.pop("email", None)
    return order


@api_router.post("/admin/products")
async def admin_create_product(payload: ProductCreate, x_admin_key: Optional[str] = Header(default=None)):
    admin_key = os.environ.get("ADMIN_KEY")
    if not admin_key:
        raise HTTPException(status_code=503, detail="Admin API disabled. Set ADMIN_KEY in backend/.env to enable.")
    if x_admin_key != admin_key:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    existing = await db.products.find_one({"slug": payload.slug})
    if existing:
        raise HTTPException(status_code=409, detail="A product with this slug already exists")
    data = payload.model_dump()
    checkout_url = data.pop("checkout_url", "")
    data.setdefault("short_title", data["title"])
    data.setdefault("product_type", "Guide")
    data.setdefault("currency", "INR")
    data.setdefault("bestseller", False)
    data.setdefault("offer_end", None)
    data.setdefault("whats_included", [])
    data.setdefault("key_benefits", [])
    data.setdefault("bonuses", [])
    data.setdefault("faqs", [])
    data.setdefault("sample_pages", [])
    data["editions"] = {
        "digital": {
            "label": "Digital Edition",
            "badge": "Instant Access",
            "price": data.get("sale_price") or data.get("regular_price"),
            "cta": "Get Instant Access",
            "note": "Digital Product • No Physical Delivery",
            "checkout_url": checkout_url,
            "features": [],
        },
    }
    data["status"] = "published"
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.products.insert_one(data)
    return {"ok": True, "slug": payload.slug}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("startup")
async def seed_database():
    await db.products.create_index("slug", unique=True)
    for product_doc in [META_ADS_DECODE_PRODUCT, AI_IDEAS_PRODUCT, PROMPT_GUIDE_PRODUCT, BUNDLE_PRODUCT]:
        doc = dict(product_doc)
        doc["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.products.update_one({"slug": doc["slug"]}, {"$set": doc}, upsert=True)
    if await db.categories.count_documents({}) == 0:
        await db.categories.insert_many([dict(c) for c in CATEGORIES])
    await db.settings.update_one({"key": "site"}, {"$set": SITE_SETTINGS}, upsert=True)
    if await db.testimonials.count_documents({}) == 0:
        await db.testimonials.insert_many([dict(t) for t in TESTIMONIALS])


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
