import { Reveal } from "../Reveal";
import { ArrowRight, BookOpen, Star } from "lucide-react";

const CHIPS = ["Digital Guide", "135+ Core Pages + Case Studies", "Instant Digital Access", "Practical Frameworks"];

const STRIP = [
  "3 Years Practical Experience",
  "Real Campaign Examples",
  "Real Ads Manager Screenshots",
  "135+ Learning Sections",
  "Case Studies + Frameworks + Checklists",
];

export default function DecodeHero({ product, onBuy, onPreview }) {
  return (
    <section className="dot-grid relative overflow-hidden border-b border-slate-200 bg-white" data-testid="decode-hero">
      <div className="container-site grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700" data-testid="hero-eyebrow">
              <Star className="h-3.5 w-3.5 fill-[#FFD400] text-[#FFD400]" />
              3 Years of Practical Experience → One Complete Guide
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]" data-testid="hero-title">
              Build Digital Products.<br />
              <span className="text-brand-600">Learn to <span className="highlight-brush">Scale</span> Them.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-base font-semibold text-slate-700 md:text-lg" data-testid="hero-subtitle">
              A complete digital product guide — with real Meta Ads campaigns, examples and case studies inside.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Learn the full journey — research and validate an idea, create the product, build the sales page, set up tracking, craft scroll-stopping creatives, then test, analyse and scale ad campaigns. One connected system, taught through real examples from 3 years of hands-on work.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onBuy}
                data-testid="hero-buy-button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-[0_12px_30px_-8px_rgba(46,26,200,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700"
              >
                Get Instant Access <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onPreview}
                data-testid="hero-preview-button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-ink ring-1 ring-slate-300 transition-colors duration-200 hover:bg-slate-50"
              >
                <BookOpen className="h-4 w-4" /> Preview the Book
              </button>
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Instant Digital Access • Read on Phone, Tablet or Desktop
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-2" data-testid="hero-info-chips">
              {CHIPS.map((chip) => (
                <span key={chip} className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-lg" data-testid="hero-visual">
          <Reveal delay={0.15}>
            <div className="relative rotate-1 transition-transform duration-300 hover:rotate-0">
              <img
                src="/samples/hero-cover.png"
                alt="Digital Product Sales Engine — guide cover with real Meta Ads dashboard preview"
                className="w-full rounded-2xl border border-slate-200 shadow-[0_35px_70px_-20px_rgba(46,26,200,0.35)]"
                data-testid="hero-cover-image"
              />
              <div className="absolute -left-3 -top-4 -rotate-6 rounded-lg bg-[#FFD400] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-ink shadow-lg sm:-left-6" data-testid="hero-sticky-note">
                Real dashboards inside →
              </div>
              <div className="absolute -bottom-4 -right-3 rotate-3 rounded-lg bg-ink-surface px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFD400] shadow-lg sm:-right-5">
                135+ pages • Case studies
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="bg-brand-600 py-3.5" data-testid="experience-strip">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
            {[...STRIP, ...STRIP].map((item, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFD400]">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
