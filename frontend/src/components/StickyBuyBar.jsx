import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, formatINR } from "../lib/api";
import { trackEvent, getStoredUtms } from "../lib/analytics";
import { startRazorpayCheckout } from "../lib/razorpay";
import BuyerEmailDialog from "./BuyerEmailDialog";
import { useOfferTimer } from "../lib/offerTimer";

const BUNDLE_SLUG = "complete-business-bundle";

/** Fixed bottom checkout bar with a one-tap Guide / Bundle switch. */
export default function StickyBuyBar({ product, offset = 600 }) {
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState("guide");
  const [busy, setBusy] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const countdown = useOfferTimer(10);
  const timerText = countdown != null
    ? `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`
    : null;

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", "sticky-bar"],
    queryFn: async () => (await api.get("/products")).data,
    staleTime: 60_000,
  });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  const edition = product?.editions?.digital;
  const bundle = allProducts.find((p) => p.slug === BUNDLE_SLUG);
  const bundleEdition = bundle?.editions?.digital;
  const hasBundle = bundleEdition?.price != null;

  if (!edition) return null;
  const regular = product?.regular_price;

  const options = [
    { key: "guide", label: "Guide Only", price: edition.price, slug: product.slug, badge: null },
    ...(hasBundle
      ? [{ key: "bundle", label: "Bundle", price: bundleEdition.price, slug: BUNDLE_SLUG, badge: "Save More" }]
      : []),
  ];
  const active = options.find((o) => o.key === choice) || options[0];

  const handleClick = () => {
    if (busy) return;
    setEmailOpen(true);
  };

  const handleEmailSubmit = async (email) => {
    setBusy(true);
    trackEvent("InitiateCheckout", {
      content_name: active.slug,
      value: active.price || undefined,
      currency: product.currency || "INR",
      ...getStoredUtms(),
    });
    await startRazorpayCheckout({
      items: [{ product_slug: active.slug, edition: "digital" }],
      email,
      onError: (msg) => toast.error("Couldn't start checkout", { description: msg }),
      onDismiss: () => { setBusy(false); setEmailOpen(false); },
    });
    setBusy(false);
    setEmailOpen(false);
  };

  return (
    <>
    <BuyerEmailDialog
      open={emailOpen}
      onOpenChange={setEmailOpen}
      onSubmit={handleEmailSubmit}
      busy={busy}
      productTitle={active.key === "bundle" ? "Complete Business Bundle" : product.title}
      total={active.price}
    />
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      data-testid="sticky-buy-bar"
    >
      <div className="container-site flex items-center justify-between gap-3 py-2.5">
        <div className="flex min-w-0 flex-col gap-1">
          {options.length > 1 ? (
            <div className="flex gap-1.5" data-testid="sticky-offer-switch">
              {options.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setChoice(o.key)}
                  data-testid={`sticky-option-${o.key}`}
                  className={`relative rounded-lg border px-3 py-1.5 text-left transition-colors duration-200 ${
                    choice === o.key ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600/40" : "border-slate-200 bg-white"
                  }`}
                >
                  {o.badge && (
                    <span className="absolute -top-2 right-1 rounded-full bg-brand-600 px-1.5 py-px font-mono text-[8px] font-bold uppercase tracking-wide text-white">
                      {o.badge}
                    </span>
                  )}
                  <span className={`block text-[10px] font-semibold ${choice === o.key ? "text-brand-700" : "text-slate-500"}`}>{o.label}</span>
                  <span className={`block font-display text-sm font-extrabold ${choice === o.key ? "text-ink" : "text-slate-400"}`}>{formatINR(o.price)}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-slate-500">{product.title}</div>
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-display text-base font-extrabold text-ink" data-testid="sticky-buy-price">{formatINR(edition.price)}</span>
                {regular > edition.price && <span className="text-xs text-slate-400 line-through">{formatINR(regular)}</span>}
              </div>
            </div>
          )}
          {timerText && (
            <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-brand-600" data-testid="sticky-buy-timer">
              Offer ends in {timerText}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          data-testid="sticky-buy-cta"
          className="shrink-0 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-700 disabled:opacity-60"
        >
          Buy Now — {formatINR(active.price)}
        </button>
      </div>
    </div>
    </>
  );
}
