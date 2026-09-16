import { Reveal } from "../Reveal";
import { BookMockup } from "../BookMockup";
import { ArrowRight, BookOpen, Zap, Layers, Target, TrendingUp } from "lucide-react";

const CHIPS = ["Digital Guide", "135+ Core Pages + Case Studies", "Instant Digital Access", "Practical Frameworks"];

const STRIP = [
  "3 Years Practical Experience",
  "Real Campaign Examples",
  "Real Ads Manager Screenshots",
  "135+ Learning Sections",
  "Case Studies + Frameworks + Checklists",
];

function FloatingCard({ className, icon: Icon, title, lines, delay = 0 }) {
  return (
    <Reveal delay={delay} className={`absolute ${className}`}>
      <div className="animate-float-soft w-44 rounded-xl bg-ink-card p-3.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-600/15">
            <Icon className="h-3.5 w-3.5 text-orange-400" />
          </span>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400">{title}</span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          {lines.map((w, i) => (
            <div key={i} className="h-1.5 rounded bg-white/10" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function DecodeHero({ product, onBuy, onPreview }) {
  return (
    <section className="ink-section dot-grid-dark relative overflow-hidden" data-testid="decode-hero">
      <div className="container-site grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
        <div>
          <Reveal>
            <span className="eyebrow-dark" data-testid="hero-eyebrow">3 Years of Practical Experience → One Complete Guide</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl" data-testid="hero-title">
              Build Digital Products.<br /><span className="highlight-brush">Learn to Scale Them.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-base font-medium text-slate-300 md:text-lg" data-testid="hero-subtitle">
              A complete digital product guide — with real Meta Ads campaigns, examples and case studies inside.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Learn the full journey — research and validate an idea, create the product, build the sales page, set up tracking, craft scroll-stopping creatives, then test, analyse and scale ad campaigns. One connected system, taught through real examples from 3 years of hands-on work.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onBuy}
                data-testid="hero-buy-button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-7 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-700"
              >
                Get Instant Access <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onPreview}
                data-testid="hero-preview-button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/5 px-7 py-4 text-sm font-semibold text-white ring-1 ring-white/15 transition-colors duration-200 hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4" /> Preview the Book
              </button>
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Instant Digital Access • Read on Phone, Tablet or Desktop
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-2" data-testid="hero-info-chips">
              {CHIPS.map((chip) => (
                <span key={chip} className="rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/10">
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none" data-testid="hero-visual">
          <Reveal delay={0.15} className="mt-10 flex justify-center sm:hidden">
            <BookMockup size="md" coverImage="/samples/cover.png" />
          </Reveal>
          <div className="relative hidden justify-center sm:flex">
            <Reveal delay={0.1} className="absolute -left-14 top-2 z-0 hidden lg:block">
              <img
                src="/samples/page-dashboard.jpg"
                alt="Real Meta Ads performance dashboard breakdown from inside the guide"
                loading="lazy"
                className="w-80 -rotate-6 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/20"
                data-testid="hero-dashboard-image"
              />
            </Reveal>
            <Reveal delay={0.2} className="relative z-10">
              <div className="animate-float-soft">
                <BookMockup size="lg" coverImage="/samples/cover.png" />
              </div>
            </Reveal>
            <FloatingCard className="-right-2 top-0 lg:right-2" icon={Layers} title="Creative Testing Matrix" lines={[72, 90, 58]} delay={0.4} />
            <FloatingCard className="-right-4 bottom-16 lg:right-0" icon={TrendingUp} title="Scaling Framework" lines={[80, 66, 84]} delay={0.5} />
            <FloatingCard className="-left-2 bottom-2 lg:left-6" icon={Zap} title="Hook Bank ×50" lines={[70, 82, 60]} delay={0.6} />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4" data-testid="experience-strip">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
            {[...STRIP, ...STRIP].map((item, i) => (
              <span key={i} className="flex items-center gap-3 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
