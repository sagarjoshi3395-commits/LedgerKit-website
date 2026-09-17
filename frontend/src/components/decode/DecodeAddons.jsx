import { useQuery } from "@tanstack/react-query";
import { api, formatINR } from "../../lib/api";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { BookMockup } from "../BookMockup";
import { CheckoutButton } from "../CheckoutButton";
import { Check } from "lucide-react";

const ADDON_SLUGS = ["ai-business-ideas-2026", "chatgpt-prompt-guide"];
const BUNDLE_SLUG = "complete-business-bundle";

function BundleVisual() {
  return (
    <div className="py-1" data-testid="bundle-visual">
      <img src="/samples/bundle-covers.png" alt="Digital Product Guide + ChatGPT Prompt Guide + AI Business Ideas Guide" loading="lazy" className="w-full rounded-xl ring-1 ring-slate-200" />
    </div>
  );
}

function AddonCard({ product, delay = 0 }) {
  const edition = product.editions?.digital;
  return (
    <Reveal delay={delay}>
      <div className="card-lift flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6" data-testid={`addon-card-${product.slug}`}>
        <div className="dot-grid flex justify-center rounded-xl border border-slate-100 bg-slate-50 py-6">
          <BookMockup size="sm" coverImage={product.cover_image} title={(product.short_title || product.title).toUpperCase()} subtitle={product.product_type} />
        </div>
        <span className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">Add-On Guide</span>
        <h3 className="mt-1.5 font-display text-base font-bold text-ink">{product.title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{product.tagline}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl font-extrabold text-ink" data-testid={`addon-price-${product.slug}`}>{formatINR(edition?.price ?? product.sale_price)}</span>
          <CheckoutButton
            product={product}
            edition="digital"
            testId={`addon-buy-${product.slug}`}
            className="bg-ink-surface px-4 py-2.5 text-xs text-white hover:bg-ink"
          >
            Add to Order
          </CheckoutButton>
        </div>
      </div>
    </Reveal>
  );
}

export default function AddonOffers({ mainProduct }) {
  const { data: products = [] } = useQuery({
    queryKey: ["products", "addons"],
    queryFn: async () => (await api.get("/products")).data,
    staleTime: 60_000,
  });

  const addons = ADDON_SLUGS.map((s) => products.find((p) => p.slug === s)).filter(Boolean);
  const bundle = products.find((p) => p.slug === BUNDLE_SLUG);
  if (!addons.length && !bundle) return null;

  const mainPrice = mainProduct?.editions?.digital?.price || 0;
  const total = mainPrice + addons.reduce((sum, p) => sum + (p.editions?.digital?.price || 0), 0);
  const bundlePrice = bundle?.editions?.digital?.price;
  const savings = bundlePrice != null && total > bundlePrice ? total - bundlePrice : null;

  return (
    <section className="bg-white py-16 sm:py-24" data-testid="addon-offers-section">
      <div className="container-site">
        <SectionHeading
          eyebrow="Complete Your Toolkit"
          title="Add These to Your Order"
          description="Two practical companions to the main guide — or grab everything together at a bundle price."
          testId="addons"
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {addons.map((p, i) => (
            <AddonCard key={p.slug} product={p} delay={i * 0.06} />
          ))}
          {bundle && (
            <Reveal delay={0.12}>
              <div className="relative flex h-full flex-col rounded-2xl border-2 border-brand-600 bg-white p-6 ring-4 ring-brand-600/10" data-testid="addon-card-bundle">
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                  Best Value
                </span>
                <BundleVisual />
                <h3 className="mt-4 font-display text-base font-bold text-ink">{bundle.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{bundle.tagline}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {(bundle.whats_included || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-baseline gap-2" data-testid="bundle-price">
                  <span className="font-display text-2xl font-extrabold text-ink">{formatINR(bundlePrice)}</span>
                  {total > 0 && <span className="text-sm text-slate-400 line-through">{formatINR(total)}</span>}
                  {savings != null && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">You Save {formatINR(savings)}</span>
                  )}
                </div>
                <CheckoutButton
                  product={bundle}
                  edition="digital"
                  testId="addon-buy-bundle"
                  className="mt-4 w-full bg-brand-600 px-5 py-3.5 text-sm text-white hover:bg-brand-700"
                >
                  Get Complete Bundle
                </CheckoutButton>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
