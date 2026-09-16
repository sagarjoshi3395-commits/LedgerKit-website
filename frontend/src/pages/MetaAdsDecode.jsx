import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, formatINR } from "../lib/api";
import { trackEvent } from "../lib/analytics";
import Seo from "../components/Seo";
import StickyBuyBar from "../components/StickyBuyBar";
import ExitIntent from "../components/ExitIntent";
import Testimonials from "../components/Testimonials";
import DecodeHero from "../components/decode/DecodeHero";
import { ExperienceSection, ProblemSection, SystemSection } from "../components/decode/DecodeSystem";
import { RealWorldSection, SamplePagesSection, IncludedSection, CurriculumSection, VisualToolsSection } from "../components/decode/DecodeLearning";
import { AudienceSection, CaseStudiesSection } from "../components/decode/DecodeAudience";
import { PricingSection, DecodeFaqSection, FinalCtaSection } from "../components/decode/DecodePurchase";
import { Skeleton } from "../components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Genuine recent-purchase notice — renders only when real paid orders exist. */
function RecentPurchaseNotice() {
  const { data } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => (await api.get("/orders/recent-summary")).data,
    staleTime: 120_000,
  });
  const [dismissed, setDismissed] = useState(false);
  if (!data?.paid_orders_last_7_days || dismissed) return null;
  return (
    <div className="fixed bottom-20 left-4 z-40 flex items-center gap-3 rounded-xl bg-white p-4 shadow-lg ring-1 ring-slate-200 sm:bottom-6" data-testid="recent-purchase-notice">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
        <ShoppingBag className="h-4 w-4 text-emerald-600" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">Someone purchased Meta Ads Decode recently</p>
        <button type="button" onClick={() => setDismissed(true)} className="text-xs text-slate-400 underline" data-testid="recent-purchase-dismiss">Dismiss</button>
      </div>
    </div>
  );
}

export default function MetaAdsDecode() {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", "meta-ads-decode"],
    queryFn: async () => (await api.get("/products/meta-ads-decode")).data,
    staleTime: 60_000,
  });
  const [selectedEdition, setSelectedEdition] = useState("digital");

  useEffect(() => {
    if (product) {
      trackEvent("ViewContent", { content_name: product.slug, content_ids: [product.slug], currency: product.currency });
    }
  }, [product]);

  const edition = product?.editions?.[selectedEdition];
  const stickyPrice = edition?.price != null ? `${edition.label} — ${formatINR(edition.price)}` : "Choose your edition";

  const faqJsonLd = product?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: product.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;

  if (isLoading) {
    return (
      <div className="container-site space-y-6 py-24" data-testid="decode-loading">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-14 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-md" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <main data-testid="meta-ads-decode-page">
      <Seo
        title="Meta Ads Decode Guide"
        description="A practical digital product & Meta Ads guide built from 3 years of real experience — research, product creation, tracking, creative strategy, testing, scaling and business measurement."
        path="/meta-ads-decode"
        jsonLd={faqJsonLd}
      />
      <DecodeHero product={product} onBuy={() => scrollToId("editions")} onPreview={() => scrollToId("samples")} />
      <ExperienceSection />
      <ProblemSection />
      <SystemSection />
      <RealWorldSection />
      <SamplePagesSection product={product} />
      <IncludedSection product={product} />
      <CurriculumSection product={product} />
      <VisualToolsSection />
      <AudienceSection product={product} />
      <CaseStudiesSection />
      <Testimonials productSlug="meta-ads-decode" title="What Readers Say" />
      <PricingSection product={product} selected={selectedEdition} onSelect={setSelectedEdition} />
      <DecodeFaqSection product={product} />
      <FinalCtaSection product={product} onSelect={setSelectedEdition} />
      {product && (
        <StickyBuyBar
          title={product.title}
          priceText={stickyPrice}
          ctaLabel="Get Meta Ads Decode"
          onCtaClick={() => scrollToId("editions")}
        />
      )}
      <ExitIntent onPreview={() => scrollToId("samples")} />
      <RecentPurchaseNotice />
    </main>
  );
}
