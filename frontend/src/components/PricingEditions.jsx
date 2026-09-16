import { Check, Minus } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import { formatINR } from "../lib/api";

function Placeholder({ text }) {
  if (text && text.includes("[")) return <span className="placeholder-token">{text}</span>;
  return <>{text}</>;
}

function EditionCard({ editionKey, edition, product, highlighted, selected, onSelect }) {
  const isBundle = editionKey === "bundle";
  const digital = product?.editions?.digital?.price;
  const physical = product?.editions?.physical?.price;
  const savings = isBundle && edition.price != null && digital != null && physical != null
    ? digital + physical - edition.price
    : null;

  return (
    <div
      onClick={() => onSelect?.(editionKey)}
      data-testid={`edition-card-${editionKey}`}
      className={`card-lift relative flex cursor-pointer flex-col rounded-2xl border bg-white p-6 sm:p-8 ${
        highlighted ? "border-orange-500 ring-2 ring-orange-500/30" : selected ? "border-ink ring-1 ring-ink/20" : "border-slate-200"
      }`}
    >
      {edition.badge && (
        <span
          className={`absolute -top-3 left-6 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
            highlighted ? "bg-orange-600 text-white" : "bg-ink-surface text-orange-400"
          }`}
        >
          {edition.badge}
        </span>
      )}
      <h3 className="font-display text-lg font-bold text-ink">{product?.short_title || product?.title} — {edition.label}</h3>
      <div className="mt-4 flex items-baseline gap-2" data-testid={`edition-price-${editionKey}`}>
        {edition.price != null ? (
          <span className="font-display text-4xl font-extrabold tracking-tight text-ink">{formatINR(edition.price)}</span>
        ) : (
          <span className="font-display text-2xl font-extrabold text-slate-400">Price TBA</span>
        )}
        {savings != null && savings > 0 && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">You Save {formatINR(savings)}</span>
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
      {editionKey === "physical" && (
        <div className="mt-4 space-y-1.5 text-xs text-slate-500" data-testid="physical-shipping-info">
          <div>Shipping: <Placeholder text={edition.shipping_charge_label} /></div>
          <div>Dispatch: <Placeholder text={edition.dispatch_label} /></div>
          <div>Delivery: <Placeholder text={edition.delivery_label} /></div>
        </div>
      )}
      <CheckoutButton
        product={product}
        edition={editionKey}
        testId={`buy-${editionKey}-button`}
        className={`mt-6 w-full px-5 py-3.5 text-sm ${
          highlighted ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-ink-surface text-white hover:bg-ink"
        }`}
      />
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-slate-400">{edition.note}</p>
    </div>
  );
}

const COMPARISON_ROWS = [
  ["Complete Guide", true, true, true],
  ["Digital PDF", true, false, true],
  ["Printed Book", false, true, true],
  ["Instant Access", true, false, "Digital copy"],
  ["Physical Delivery", false, true, true],
];

function Cell({ v }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-emerald-600" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-slate-300" />;
  return <span className="text-xs font-medium text-slate-600">{v}</span>;
}

export default function PricingEditions({ product, selected, onSelect }) {
  const editions = product?.editions || {};
  const keys = ["digital", "physical", "bundle"].filter((k) => editions[k]);
  if (!keys.length) return null;

  return (
    <div>
      <div className="grid gap-6 pt-4 lg:grid-cols-3" data-testid="pricing-editions">
        {keys.map((k) => (
          <EditionCard
            key={k}
            editionKey={k}
            edition={editions[k]}
            product={product}
            highlighted={k === "bundle"}
            selected={selected === k}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="mt-12 overflow-x-auto rounded-xl border border-slate-200 bg-white" data-testid="edition-comparison-table">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3.5 font-display font-bold text-ink">Feature</th>
              <th className="px-5 py-3.5 text-center font-display font-bold text-ink">Digital Edition</th>
              <th className="px-5 py-3.5 text-center font-display font-bold text-ink">Physical Book</th>
              <th className="px-5 py-3.5 text-center font-display font-bold text-ink">Complete Bundle</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map(([label, d, p, b]) => (
              <tr key={label} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3 text-slate-600">{label}</td>
                <td className="px-5 py-3 text-center"><Cell v={d} /></td>
                <td className="px-5 py-3 text-center"><Cell v={p} /></td>
                <td className="px-5 py-3 text-center"><Cell v={b} /></td>
              </tr>
            ))}
            <tr className="bg-slate-50">
              <td className="px-5 py-3.5 font-semibold text-ink">Price</td>
              <td className="px-5 py-3.5 text-center font-display font-extrabold text-ink">{formatINR(editions.digital?.price) || "TBA"}</td>
              <td className="px-5 py-3.5 text-center font-display font-extrabold text-ink">{formatINR(editions.physical?.price) || "TBA"}</td>
              <td className="px-5 py-3.5 text-center font-display font-extrabold text-orange-600">{formatINR(editions.bundle?.price) || "TBA"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
