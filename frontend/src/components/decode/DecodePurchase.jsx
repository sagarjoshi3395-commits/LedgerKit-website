import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import PricingEditions from "../PricingEditions";
import FaqAccordion from "../FaqAccordion";
import CountdownTimer from "../CountdownTimer";
import { CheckoutButton } from "../CheckoutButton";
import { ShieldCheck, Zap, Headset, ImagePlus } from "lucide-react";

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "Secure Payment", text: "Payment is handled through the configured payment provider." },
  { icon: Zap, title: "Instant Digital Delivery", text: "Digital access instructions are provided after successful payment." },
  { icon: Headset, title: "Support Available", text: "Contact support if you experience payment or access issues." },
];

export function PricingSection({ product, selected, onSelect }) {
  return (
    <section id="editions" className="scroll-mt-20 py-16 sm:py-24" data-testid="pricing-section">
      <div className="container-site">
        <SectionHeading
          eyebrow="Choose Your Edition"
          title="Choose How You Want to Read Meta Ads Decode"
          description="Get instant digital access, order the printed physical edition, or choose both. Transparent pricing — no false scarcity."
          testId="pricing"
        />
        {product?.offer_end && (
          <Reveal className="mt-8 flex justify-center">
            <CountdownTimer end={product.offer_end} />
          </Reveal>
        )}
        <div className="mt-10">
          <PricingEditions product={product} selected={selected} onSelect={onSelect} />
        </div>

        <Reveal className="mt-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8" data-testid="physical-gallery">
            <h3 className="font-display text-lg font-bold text-ink">The Printed Edition</h3>
            <p className="mt-1 text-sm text-slate-500">Real photographs of the physical book are uploaded to these slots.</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {(product?.physical_gallery_slots || []).map((slot, i) => (
                <div key={slot} className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-center" data-testid={`physical-slot-${i}`}>
                  <ImagePlus className="h-4 w-4 text-slate-400" />
                  <span className="text-[11px] font-medium leading-tight text-slate-500">{slot}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3" data-testid="checkout-trust">
          {TRUST_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-6 text-center">
                <item.icon className="h-5 w-5 text-orange-600" />
                <h4 className="font-display text-sm font-bold text-ink">{item.title}</h4>
                <p className="text-xs leading-relaxed text-slate-500">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DecodeFaqSection({ product }) {
  const faqs = product?.faqs || [];
  if (!faqs.length) return null;
  return (
    <section className="bg-white py-16 sm:py-24" data-testid="decode-faq-section">
      <div className="container-site max-w-3xl">
        <SectionHeading eyebrow="Questions, Answered" title="Meta Ads Decode — FAQ" testId="decode-faq" />
        <div className="mt-10">
          <FaqAccordion items={faqs} testId="decode-faq" />
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection({ product, onSelect }) {
  const editions = product?.editions || {};
  return (
    <section className="ink-section dot-grid-dark py-16 sm:py-24" data-testid="final-cta-section">
      <div className="container-site text-center">
        <Reveal>
          <span className="eyebrow-dark">Research → Product → Ads → Analysis → Scaling → Measurement</span>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl" data-testid="final-cta-title">
            Three Years of Experience. One Complete Practical Guide.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Learn the complete digital-product and Meta Ads system through practical workflows, campaign examples, frameworks, checklists and real-world lessons. Stop guessing what to do next — understand the whole system.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" data-testid="final-cta-buttons">
            {editions.digital && (
              <CheckoutButton product={product} edition="digital" testId="final-buy-digital" className="w-full bg-orange-600 px-6 py-4 text-sm text-white hover:bg-orange-700 sm:w-auto" />
            )}
            {editions.physical && (
              <CheckoutButton product={product} edition="physical" testId="final-buy-physical" className="w-full bg-white/10 px-6 py-4 text-sm text-white ring-1 ring-white/20 hover:bg-white/15 sm:w-auto" />
            )}
            {editions.bundle && (
              <CheckoutButton product={product} edition="bundle" testId="final-buy-bundle" className="w-full bg-white/10 px-6 py-4 text-sm text-white ring-1 ring-white/20 hover:bg-white/15 sm:w-auto" />
            )}
          </div>
          <p className="mt-5 text-sm font-medium text-slate-300">Choose the format that works best for you.</p>
          <p className="mx-auto mt-3 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.15em] text-slate-500">
            Digital Product • Secure Checkout • Instant Access
          </p>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-slate-500">
            Educational product. Advertising and business results vary based on product, market, offer, creative, budget, competition and execution.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
