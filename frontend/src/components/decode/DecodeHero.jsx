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
              Research. Build.<br />Test. <span className="text-orange-500">Scale.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-base font-medium text-slate-300 md:text-lg" data-testid="hero-subtitle">
              A practical digital product &amp; Meta Ads guide built from 3 years of real experience.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Learn the complete process — from finding and validating digital-product opportunities to creating the product, building the sales page, setting up tracking, creating ads, testing campaigns, analysing results and scaling what works.
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
                Get Meta Ads Decode <ArrowRight className="h-4 w-4" />
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
              Available as Digital Edition, Physical Book or Complete Bundle
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

        <div className="relative mx-auto hidden w-full max-w-md justify-center sm:flex lg:max-w-none" data-testid="hero-visual">
          <Reveal delay={0.2}>
            <div className="animate-float-soft">
              <BookMockup size="lg" />
            </div>
          </Reveal>
          <FloatingCard className="-left-4 top-6 lg:-left-10" icon={Target} title="Campaign Diagnostics" lines={[88, 64, 76]} delay={0.35} />
          <FloatingCard className="-right-2 top-1/3 lg:right-0" icon={Layers} title="Creative Testing Matrix" lines={[72, 90, 58]} delay={0.45} />
          <FloatingCard className="-left-2 bottom-8 lg:left-2" icon={TrendingUp} title="Scaling Framework" lines={[80, 66, 84]} delay={0.55} />
          <FloatingCard className="-right-4 bottom-24 hidden lg:block" icon={Zap} title="Hook Bank ×50" lines={[70, 82, 60]} delay={0.65} />
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
