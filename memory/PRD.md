# PRD — Decode Digital Products Storefront

## Original Problem Statement
Build a complete, premium, conversion-focused digital-product ecommerce website for the user's brand, selling downloadable guides/ebooks/templates. Flagship product: **Meta Ads Decode Guide** — a digital-product + Meta Ads execution guide positioned around "3 Years of Practical Experience → One Complete Guide", sold in 3 editions: Digital ₹299 (instant access), Physical ₹899 (shipped), Bundle (price TBA by user). Hard rules: no fake testimonials, sales numbers, countdowns, trust badges or income claims; mobile-first; data-driven product architecture; Razorpay/SuperProfile-ready checkout via configurable per-edition checkout URLs; full legal page set; SEO + tracking readiness.

## Architecture
- **Backend** (FastAPI + MongoDB): `/app/backend/server.py` + `/app/backend/seed_data.py`
  - Collections: products, categories, testimonials, orders, contact_messages, settings
  - Endpoints: GET /api/products (search/category/sort/featured), GET /api/products/{slug}, GET /api/categories, GET /api/settings, GET /api/testimonials, POST /api/contact, POST /api/orders (order intent → returns edition checkout_url), GET /api/orders/{id}, GET /api/orders/recent-summary (genuine paid count only), POST /api/admin/products (requires ADMIN_KEY env + x-admin-key header)
  - Product doc is fully data-driven: editions (digital/physical/bundle with own price + checkout_url), curriculum, sample_pages, faqs, who_for, not_for, bonuses, whats_included, offer_end (real countdown only), featured/is_new/bestseller flags
- **Frontend** (React + Tailwind + framer-motion): pages Home, /products, /products/:slug, /meta-ads-decode, /about, /contact, /faq, /legal/:slug (6 policies), /order-success, /admin
  - Legal copy: `/app/frontend/src/lib/legalContent.js` (editable, [PLACEHOLDERS] highlighted in amber)
  - Site copy/nav/footer: `/app/frontend/src/lib/siteContent.js`
  - Tracking: `/app/frontend/src/lib/analytics.js` — Meta Pixel via REACT_APP_META_PIXEL_ID, GA via REACT_APP_GA_MEASUREMENT_ID (auto-injected in public/index.html); events PageView/ViewContent/InitiateCheckout; UTM capture + passthrough to checkout
  - SEO: Seo.jsx (title/meta/OG/canonical/JSON-LD Product+FAQ), public/sitemap.xml, public/robots.txt
- **Design system**: Swiss/editorial — light #FAFAFA base, obsidian #090D16 conversion sections, ember #EA580C accent; Plus Jakarta Sans display / DM Sans body / JetBrains Mono labels

## User Personas
Students; side-income explorers; beginners in digital business; existing digital-product sellers; small business owners.

## Implemented (2026-09-16)
- Home page: hero, featured product with sample previews, 4 value cards, dynamic product grid, horizontal "Learn Visually" gallery, why-different cards, auto-hiding testimonials, full-width CTA
- /meta-ads-decode landing: dark hero w/ CSS 3D book mockup + floating framework cards, info chips, experience marquee strip, "3 Years of Doing" section, problem section, animated 16-step workflow, real-world screenshot upload slots, interactive sample-page viewer (10 placeholder slots), what's included, 16-part curriculum accordion (13 parts + bonus + case studies + closing), visual tools, who-for (5 segments), what-it's-not, bonus toolkit, 3 case-study cards, 3-edition SaaS pricing + comparison table + genuine savings calc, physical-book photo slots, checkout trust, product FAQ, final CTA, sticky mobile buy bar (scrolls to editions, reflects selected edition), gentle desktop exit-intent, recent-purchase notice (hidden — 0 genuine paid orders)
- /products store: search, 8 category filters, sort, count, badges (New/Featured; Bestseller only if flagged)
- Reusable product detail template (/products/:slug) with Product JSON-LD
- Legal: Terms, Privacy, Refund & Cancellation (digital/physical/bundle separated), Shipping & Delivery, Digital Delivery, Disclaimer — all footer-linked with editable highlighted placeholders
- About, Contact (working form → DB, topic select, placeholder business info), FAQ (with FAQ JSON-LD), Order Success (honest: shows "Order Received" until server-side payment confirmation), Admin add-product form
- Seeded Meta Ads Decode product with full curriculum, FAQs, editions

## Verified
- curl: health, product list/detail, filtered/sorted search, order intent (ORD-… created, empty checkout_url → frontend toast), contact POST, recent-summary=0, admin 503 without key
- Screenshots: home hero, decode hero/workflow/pricing/curriculum accordion, mobile 390px hero + sticky bar scroll-to-editions, products store search, contact form submit (toast confirmed), refund policy page

## Update (2026-09-16, v2 — per user request)
- Brand renamed to **LedgerKit** everywhere (logo, settings, SEO, legal, about, FAQs); support = ledgerkitsupport@gmail.com only (phone removed)
- Digital-only: physical book + bundle editions removed everywhere; shipping policy page removed; ₹1699 regular → ₹299 launch price with auto savings (82% / ₹1,400)
- Buy buttons direct-redirect to SuperProfile checkout: https://superprofile.bio/vp/6aab089e0cce8b001386b6f9 (order intent still recorded server-side; UTMs preserved)
- Real launch countdown (offer_end = 2026-09-30 23:59 IST, editable in seed_data.py) shown at pricing + sticky bar; auto-hides after expiry
- Fixed bottom checkout bar on ALL screens (price + timer + Buy Now direct redirect)
- City-based purchase popups (PurchaseNotifications.jsx, config PURCHASE_PINGS in lib/siteContent.js — set enabled:false to disable; auto-switches to verified mode when genuine paid orders exist)
- Hero repositioned: "Build Digital Products. Learn to Scale Them." + real Ads Manager dashboard page behind book mockup; copy now emphasizes complete digital-product guide with Meta Ads examples inside
- Sample pages: 5 real book pages (user-provided, in /public/samples/) shown as auto-scrolling flow strip (hover to pause, tap to open preview dialog) — rest of pages kept exclusive
- "What This Guide Is Not" reframed to positive "Go In With the Right Expectations"

## Backlog (prioritized)
- **P0**: Configure real per-edition checkout URLs (SuperProfile) in product data; set bundle price; set ADMIN_KEY in backend/.env; replace [PLACEHOLDER] business details (support email/phone/address, refund/shipping timelines); upload real sample pages, Ads Manager screenshots, physical-book photos
- **P1**: Direct Razorpay integration (create order → checkout → server-side signature verify → paid status → delivery email → /order-success); customer download/access flow; admin UI for editing products/settings/testimonials; real testimonials once collected
- **P2**: Meta CAPI server-side events, offer countdown config, physical order shipping status tracking in admin

## Credentials
- No user-facing auth. Admin product API requires ADMIN_KEY env var (currently unset → admin disabled by design). See /app/memory/test_credentials.md.
