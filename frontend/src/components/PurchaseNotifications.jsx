import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, X, BadgeCheck } from "lucide-react";
import { api } from "../lib/api";
import { PURCHASE_PINGS } from "../lib/siteContent";

/**
 * Social-proof purchase popup. Cities/timing are configured in lib/siteContent.js (PURCHASE_PINGS).
 * When genuine paid orders exist in the backend, it automatically switches to verified mode.
 * Set PURCHASE_PINGS.enabled = false to disable completely.
 */
export default function PurchaseNotifications({ productTitle = "Meta Ads Decode" }) {
  const { data } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => (await api.get("/orders/recent-summary")).data,
    staleTime: 300_000,
  });
  const [ping, setPing] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    if (data === undefined || !PURCHASE_PINGS.enabled) return;
    const genuine = (data?.paid_orders_last_7_days || 0) > 0;
    const delay = () =>
      (PURCHASE_PINGS.minDelaySec + Math.random() * (PURCHASE_PINGS.maxDelaySec - PURCHASE_PINGS.minDelaySec)) * 1000;

    const show = () => {
      if (genuine) {
        setPing({ text: `Someone purchased ${productTitle} recently`, sub: "Verified order", verified: true });
      } else {
        const city = PURCHASE_PINGS.cities[Math.floor(Math.random() * PURCHASE_PINGS.cities.length)];
        const mins = [2, 4, 5, 8, 11, 14][Math.floor(Math.random() * 6)];
        setPing({ text: `A reader from ${city} got ${productTitle}`, sub: `${mins} min ago`, verified: false });
      }
      timers.current.push(setTimeout(() => setPing(null), 6000));
      timers.current.push(setTimeout(show, delay()));
    };
    timers.current.push(setTimeout(show, 9000));
    const stash = timers.current;
    return () => stash.forEach(clearTimeout);
  }, [data, productTitle]);

  if (!ping) return null;
  return (
    <div
      className="fixed bottom-20 left-4 z-40 flex max-w-[300px] items-start gap-3 rounded-xl bg-white p-3.5 pr-8 shadow-xl ring-1 ring-slate-200 sm:bottom-24"
      data-testid="purchase-ping"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
        <ShoppingBag className="h-4 w-4 text-emerald-600" />
      </span>
      <div>
        <p className="text-xs font-semibold leading-snug text-ink">{ping.text}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
          {ping.verified && <BadgeCheck className="h-3 w-3 text-blue-500" />}
          {ping.sub}
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setPing(null)}
        className="absolute right-2 top-2 text-slate-300 transition-colors hover:text-slate-500"
        data-testid="purchase-ping-dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
