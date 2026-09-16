import { useEffect, useState } from "react";

/** Genuine offer countdown. Renders nothing unless a real end timestamp is configured and still in the future. */
export default function CountdownTimer({ end, dark = false }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!end) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [end]);

  if (!end) return null;
  const target = new Date(end).getTime();
  const diff = target - now;
  if (Number.isNaN(target) || diff <= 0) return null;

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const units = days > 0
    ? [[days, "Days"], [hours, "Hours"], [minutes, "Mins"], [seconds, "Secs"]]
    : [[hours, "Hours"], [minutes, "Minutes"], [seconds, "Seconds"]];
  const cell = `flex min-w-[64px] flex-col items-center rounded-lg px-3 py-2 ${
    dark ? "bg-white/10 ring-1 ring-white/15" : "bg-white ring-1 ring-slate-200"
  }`;

  return (
    <div className="flex flex-col items-center gap-2" data-testid="offer-countdown">
      <span className={`font-mono text-[11px] font-semibold uppercase tracking-[0.2em] ${dark ? "text-orange-400" : "text-orange-600"}`}>
        Launch Offer Ends In
      </span>
      <div className="flex items-center gap-2">
        {units.map(([v, label]) => (
          <div key={label} className={cell}>
            <span className={`font-display text-xl font-extrabold tabular-nums ${dark ? "text-white" : "text-ink"}`}>
              {String(v).padStart(2, "0")}
            </span>
            <span className={`font-mono text-[9px] uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
