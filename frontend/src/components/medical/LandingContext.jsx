import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { trackEvent, getStoredUtms } from "../../lib/analytics";
import { startRazorpayCheckout } from "../../lib/razorpay";
import BuyerEmailDialog from "../BuyerEmailDialog";

const MrgBuyCtx = createContext({
  product: null, openBuy: () => {}, price: 199, regularPrice: 1999,
  addOns: [], selectedAddOns: [], toggleAddOn: () => {}, addOnTotal: 0, total: 199,
});
export const useMrgBuy = () => useContext(MrgBuyCtx);

const FALLBACK = {
  slug: "medical-reference-bundle",
  title: "Medical Diseases & Ayurvedic Reference Bundle",
  short_title: "Medical Reference Bundle",
  currency: "INR",
  price: 199,
  regular_price: 1999,
};

const FALLBACK_ADDONS = [
  { slug: "ecg-guide", title: "ECG Guide", description: "Read ECG strips with confidence — rate, rhythm & axis made simple.", price: 99 },
  { slug: "emergency-guide", title: "Emergency Guide", description: "Emergency presentations & first-response steps for quick revision.", price: 149 },
  { slug: "ayurvedic-medicine-guide", title: "Ayurvedic Medicine Guide", description: "Common Ayurvedic medicines & remedies organised for easy reference.", price: 99 },
  { slug: "physiotherapy-clinical-guide", title: "Physiotherapy Clinical Guide", description: "Assessment approaches, treatment plans & exercise programmes at a glance.", price: 149 },
  { slug: "lab-report-guide", title: "Lab Report Guide", description: "Understand common lab markers and reference ranges in plain language.", price: 99 },
];

export function MrgBuyProvider({ children }) {
  const [product, setProduct] = useState(FALLBACK);
  const [addOns, setAddOns] = useState(FALLBACK_ADDONS);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [includeAddOns, setIncludeAddOns] = useState(false);

  useEffect(() => {
    api.get("/products/medical-reference-bundle").then(({ data }) => {
      const edition = data?.editions?.digital || {};
      setProduct((p) => ({
        ...p,
        ...data,
        price: edition.price ?? data.sale_price ?? p.price,
        regular_price: edition.regular_price ?? data.regular_price ?? p.regular_price,
      }));
    }).catch(() => {});
    api.get("/add-ons").then(({ data }) => {
      if (Array.isArray(data) && data.length) {
        setAddOns(data.map((a) => ({
          slug: a.slug,
          title: a.short_title || a.title,
          description: a.tagline || "",
          price: a.editions?.digital?.price ?? a.sale_price ?? 0,
        })));
      }
    }).catch(() => {});
  }, []);

  const addOnTotal = addOns
    .filter((a) => selectedAddOns.includes(a.slug))
    .reduce((s, a) => s + (a.price || 0), 0);
  const total = product.price + addOnTotal;

  const openBuy = (withAddOns) => {
    if (loading) return;
    setIncludeAddOns(withAddOns === true);
    setEmailOpen(true);
  };

  const toggleAddOn = (slug) =>
    setSelectedAddOns((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  async function handleEmailSubmit(email) {
    setLoading(true);
    const chosen = includeAddOns ? selectedAddOns : [];
    const items = [{ product_slug: product.slug }, ...chosen.map((slug) => ({ product_slug: slug }))];
    const charge = includeAddOns ? total : product.price;
    trackEvent("InitiateCheckout", {
      content_name: product.slug,
      value: charge,
      currency: product.currency || "INR",
      ...getStoredUtms(),
    });
    await startRazorpayCheckout({
      items,
      email,
      onError: (msg) => toast.error("Couldn't start checkout", { description: msg }),
      onDismiss: () => {
        setLoading(false);
        setEmailOpen(false);
      },
      onSuccess: ({ order_id }) => {
        window.location.href = `/order-success?order_id=${order_id}`;
      },
    });
    setLoading(false);
    setEmailOpen(false);
  }

  return (
    <MrgBuyCtx.Provider value={{ product, openBuy, price: product.price, regularPrice: product.regular_price, addOns, selectedAddOns, toggleAddOn, addOnTotal, total }}>
      {children}
      <BuyerEmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        onSubmit={handleEmailSubmit}
        busy={loading}
        productTitle={product.short_title || product.title}
        total={includeAddOns ? total : product.price}
      />
    </MrgBuyCtx.Provider>
  );
}
