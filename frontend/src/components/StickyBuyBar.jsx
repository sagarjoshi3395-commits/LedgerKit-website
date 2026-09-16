import { useEffect, useState } from "react";

/** Mobile sticky purchase bar. Appears after scrolling past `offset`. */
export default function StickyBuyBar({ title, priceText, ctaLabel, onCtaClick, offset = 600 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      data-testid="sticky-buy-bar"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-slate-500">{title}</div>
          <div className="font-display text-base font-extrabold text-ink" data-testid="sticky-buy-price">{priceText}</div>
        </div>
        <button
          type="button"
          onClick={onCtaClick}
          data-testid="sticky-buy-cta"
          className="shrink-0 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-700"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
