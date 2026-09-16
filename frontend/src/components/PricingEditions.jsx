import { Check } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import { formatINR } from "../lib/api";

export default function PricingEditions({ product }) {
  const edition = product?.editions?.digital;
  if (!edition) return null;
  const regular = product?.regular_price;
  const savings = edition.price != null && regular != null && regular > edition.price ? regular - edition.price : null;
  const pct = savings != null ? Math.round((savings / regular) * 100) : null;

  return (
    <div className="mx-auto max-w-xl" data-testid="pricing-editions">
      <div className="card-lift relative flex flex-col rounded-2xl border border-orange-500 bg-white p-6 ring-2 ring-orange-500/30 sm:p-8" data-testid="edition-card-digital">
        <span className="absolute -top-3 left-6 rounded-full bg-orange-600 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
          {edition.badge || "Instant Access"}
        </span>
        {pct != null && (
          <span className="absolute -top-3 right-6 rounded-full bg-ink-surface px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-orange-400" data-testid="edition-discount-badge">
            {pct}% Off — Launch Offer
          </span>
        )}
        <h3 className="mt-1 font-display text-lg font-bold text-ink">{product?.title} — {edition.label}</h3>
        <div className="mt-4 flex flex-wrap items-baseline gap-3" data-testid="edition-price-digital">
          <span className="font-display text-5xl font-extrabold tracking-tight text-ink">{formatINR(edition.price)}</span>
          {regular > edition.price && <span className="text-xl text-slate-400 line-through">{formatINR(regular)}</span>}
          {savings != null && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">You Save {formatINR(savings)}</span>
          )}
        </div>
        <ul className="mt-6 flex-1 space-y-2.5">
          {(edition.features || []).map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <CheckoutButton
          product={product}
          edition="digital"
          testId="buy-digital-button"
          className="mt-6 w-full bg-orange-600 px-5 py-4 text-base text-white hover:bg-orange-700"
        />
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-slate-400">
          {edition.note || "Secure Checkout • Digital Product • Instant Access"}
        </p>
      </div>
    </div>
  );
}
