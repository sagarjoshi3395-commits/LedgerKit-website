import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../lib/api";
import { trackEvent, getStoredUtms } from "../../lib/analytics";
import { startRazorpayCheckout } from "../../lib/razorpay";
import BuyerEmailDialog from "../BuyerEmailDialog";

const MrgBuyCtx = createContext({ product: null, openBuy: () => {}, price: 299, regularPrice: 1999 });
export const useMrgBuy = () => useContext(MrgBuyCtx);

const FALLBACK = {
  slug: "medical-reference-bundle",
  title: "Medical Diseases & Ayurvedic Reference Bundle",
  short_title: "Medical Reference Bundle",
  currency: "INR",
  price: 299,
  regular_price: 1999,
};

export function MrgBuyProvider({ children }) {
  const [product, setProduct] = useState(FALLBACK);
  const [loading, setLoading] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    api.get("/products/medical-reference-bundle").then(({ data }) => {
      const edition = data?.editions?.digital || {};
      setProduct({
        ...FALLBACK,
        ...data,
        price: edition.price ?? data.price ?? FALLBACK.price,
        regular_price: edition.regular_price ?? data.regular_price ?? FALLBACK.regular_price,
      });
    }).catch(() => {});
  }, []);

  const openBuy = () => {
    if (!loading) setEmailOpen(true);
  };

  async function handleEmailSubmit(email) {
    setLoading(true);
    trackEvent("InitiateCheckout", {
      content_name: product.slug,
      value: product.price,
      currency: product.currency || "INR",
      ...getStoredUtms(),
    });
    await startRazorpayCheckout({
      items: [{ product_slug: product.slug }],
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
    <MrgBuyCtx.Provider value={{ product, openBuy, price: product.price, regularPrice: product.regular_price }}>
      {children}
      <BuyerEmailDialog
        open={emailOpen}
        onOpenChange={setEmailOpen}
        onSubmit={handleEmailSubmit}
        busy={loading}
        productTitle={product.short_title || product.title}
        total={product.price}
      />
    </MrgBuyCtx.Provider>
  );
}
