import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { trackEvent, getStoredUtms } from "../lib/analytics";
import { startRazorpayCheckout } from "../lib/razorpay";

/**
 * Purchase button. Opens the Razorpay checkout for this product edition,
 * verifies the payment server-side, then routes to /order-success.
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
    await startRazorpayCheckout({
      items: [{ product_slug: product.slug, edition }],
      onError: (msg) => toast.error("Couldn't start checkout", { description: msg }),
      onDismiss: () => setLoading(false),
      onSuccess: ({ order_id }) => {
        window.location.href = `/order-success?order_id=${order_id}`;
      },
    });
    setLoading(false);
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
