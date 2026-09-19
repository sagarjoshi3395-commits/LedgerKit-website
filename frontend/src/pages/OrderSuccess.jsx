import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Clock, Mail, ArrowRight, Download } from "lucide-react";
import { api, formatINR } from "../lib/api";
import { trackEvent, getStoredUtms } from "../lib/analytics";
import Seo from "../components/Seo";
import { Skeleton } from "../components/ui/skeleton";

const STATUS_LABELS = {
  payment_pending: "Payment confirmation pending",
  paid: "Paid",
  delivered: "Digital Access Delivered",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => (await api.get(`/orders/${orderId}`)).data,
    enabled: Boolean(orderId),
    retry: false,
  });

  const { data: product } = useQuery({
    queryKey: ["product", "meta-ads-decode"],
    queryFn: async () => (await api.get("/products/meta-ads-decode")).data,
    staleTime: 60_000,
  });

  function handleDownload() {
    if (product?.download_url) {
      window.open(product.download_url, "_blank");
    } else {
      toast.info("Download link is on its way", {
        description: "Your access link is delivered by the payment provider — please check your email inbox (and spam folder).",
      });
    }
  }

  const paid = order?.status === "paid" || order?.status === "delivered";

  // Fire the Meta Pixel Purchase event exactly once when a paid order loads.
  const purchaseFired = useRef(false);
  useEffect(() => {
    if (paid && order && !purchaseFired.current) {
      purchaseFired.current = true;
      trackEvent("Purchase", {
        content_name: order.product_slug,
        content_category: order.edition,
        value: order.amount || undefined,
        currency: order.currency || "INR",
        order_id: order.order_id,
        ...getStoredUtms(),
      });
    }
  }, [paid, order]);

  return (
    <main className="py-16 sm:py-24" data-testid="order-success-page">
      <Seo title="Order Status" description="Your order and digital product access details." path="/order-success" />
      <div className="container-site max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-12">
          {orderId && isLoading ? (
            <div className="space-y-4"><Skeleton className="mx-auto h-12 w-12 rounded-full" /><Skeleton className="mx-auto h-6 w-56" /><Skeleton className="mx-auto h-4 w-72" /></div>
          ) : (
            <>
              <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${paid ? "bg-emerald-100" : "bg-amber-100"}`}>
                {paid ? <CheckCircle2 className="h-7 w-7 text-emerald-600" /> : <Clock className="h-7 w-7 text-amber-600" />}
              </span>
              <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink" data-testid="order-status-title">
                {paid ? "Payment Successful" : "Order Received"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base" data-testid="order-status-message">
                {paid
                  ? "Your digital product is ready. Access instructions have been sent to your email."
                  : "Thank you for your order. If your payment was completed with the payment provider, your access instructions will be sent to your email shortly after payment confirmation."}
              </p>

              {order && (
                <div className="mt-8 space-y-3 rounded-xl bg-slate-50 p-6 text-left ring-1 ring-slate-200" data-testid="order-details">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Order ID</span><span className="font-mono font-semibold text-ink" data-testid="order-id-value">{order.order_id}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Product</span><span className="font-medium text-ink">{order.product_title}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Edition</span><span className="font-medium capitalize text-ink">{order.edition}</span></div>
                  {order.amount != null && <div className="flex justify-between text-sm"><span className="text-slate-500">Amount</span><span className="font-medium text-ink">{formatINR(order.amount)}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span><span className="font-medium text-ink" data-testid="order-status-value">{STATUS_LABELS[order.status] || order.status}</span></div>
                </div>
              )}

              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  data-testid="download-now-button"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-700"
                >
                  <Download className="h-4 w-4" /> Download Now
                </button>
                <Link to="/products" className="inline-flex items-center gap-2 rounded-lg bg-ink-surface px-6 py-3.5 text-sm font-semibold text-white hover:bg-ink" data-testid="order-continue-link">
                  Continue Browsing <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink" data-testid="order-support-link">
                  <Mail className="h-4 w-4" /> Need help? Contact support
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
