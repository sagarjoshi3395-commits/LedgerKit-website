import { useEffect, useState } from "react";
import { formatINR } from "../lib/api";
import { trackEvent, appendUtms, getStoredUtms } from "../lib/analytics";
import { useOfferTimer } from "../lib/offerTimer";

/** Fixed bottom checkout bar (all screens). Direct-redirects to the product's configured checkout URL. */
export default function StickyBuyBar({ product, offset = 600 }) {
  const [visible, setVisible] = useState(false);
  const countdown = useOfferTimer(10);
  const timerText = countdown != null
    ? `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`
    : null;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  const edition = product?.editions?.digital;
  if (!edition) return null;
  const regular = product?.regular_price;

  const handleClick = () => {
    trackEvent("InitiateCheckout", {
      content_name: product.slug,
      value: edition.price || undefined,
      currency: product.currency || "INR",
      ...getStoredUtms(),
    });
    if (edition.checkout_url) window.location.href = appendUtms(edition.checkout_url);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      data-testid="sticky-buy-bar"
    >
      <div className="container-site flex items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-slate-500">{product.title}</div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-base font-extrabold text-ink" data-testid="sticky-buy-price">{formatINR(edition.price)}</span>
            {regular > edition.price && <span className="text-xs text-slate-400 line-through">{formatINR(regular)}</span>}
            {timerText && (
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-600" data-testid="sticky-buy-timer">
                Offer ends in {timerText}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleClick}
          data-testid="sticky-buy-cta"
          className="shrink-0 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-700"
        >
          Buy Now — {formatINR(edition.price)}
        </button>
      </div>
    </div>
  );
}
