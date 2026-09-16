import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { trackEvent, appendUtms, getStoredUtms } from "../lib/analytics";

/**
 * Purchase button. Creates an order-intent in the backend, then redirects to the
 * edition's configured checkout_url (SuperProfile / Razorpay / any provider).
 * If no checkout URL is configured yet, it informs the visitor instead of faking a checkout.
 */
export function CheckoutButton({ product, edition = "digital", className = "", children, testId }) {
  const [loading, setLoading] = useState(false);
  const editionData = product?.editions?.[edition];
  const price = editionData?.price;

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    trackEvent("InitiateCheckout", {
      content_name: product?.slug,
      content_category: edition,
      value: price || undefined,
      currency: product?.currency || "INR",
      ...getStoredUtms(),
    });
    try {
      const res = await api.post("/orders", { product_slug: product.slug, edition });
      const url = res.data.checkout_url;
      if (url) {
        window.location.href = appendUtms(url);
        return;
      }
      toast.info("Checkout link not connected yet", {
        description: `Order reference ${res.data.order_id} was created. The store owner still needs to add the ${editionData?.label || edition} payment link.`,
      });
    } catch (err) {
      toast.error("Couldn't start checkout", { description: "Please try again in a moment." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      data-testid={testId || `buy-${edition}-button`}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-60 ${className}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children || editionData?.cta || "Get Instant Access"}
      {price != null && <span className="opacity-80">— ₹{Number(price).toLocaleString("en-IN")}</span>}
    </button>
  );
}
