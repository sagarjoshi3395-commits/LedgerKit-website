# PRD — LedgerKit Digital Products Storefront (imported from GitHub)

## Original Problem Statement
Import the LedgerKit website from https://github.com/sagarjoshi3395-commits/LedgerKit-website.git into this workspace and run it. The repo is a complete, premium, conversion-focused digital-product ecommerce site (built on this same Emergent stack over 16 iterations, Sept 2026): flagship product **Digital Product Sales Engine** (₹299) plus AI Business Ideas Guide (₹199), ChatGPT Prompt Guide (₹149), Complete Business Bundle (₹499) and Medical Diseases & Ayurvedic Reference Bundle (₹299) — sold via native Razorpay checkout with automatic email delivery of the PDF files.

## Architecture
- **Backend** (FastAPI + MongoDB): server.py, seed_data.py, email_service.py
  - Collections: products, categories, testimonials, orders, contact_messages, settings (seeded idempotently on startup)
  - Endpoints: /api/products (search/category/sort), /api/products/{slug}, /api/categories, /api/settings, /api/testimonials, /api/contact, /api/orders (order intent), /api/orders/{id} (adds downloads[] when paid), /api/orders/recent-summary, /api/checkout/create-order + /api/checkout/verify (Razorpay), /api/admin/products (ADMIN_KEY-gated)
  - Paid orders auto-expand to per-guide download files; Resend proxy email (EMERGENT_EMAIL_KEY) delivers them
- **Frontend** (React 19 + craco + Tailwind + framer-motion): pages Home, /products, /products/:slug, /meta-ads-decode (Sales Engine landing with hero video, curriculum accordion, bump offers, 10-min per-visitor urgency timer), /about, /contact, /faq, /legal/:slug, /order-success (live download cards), /admin, NotFound
  - Design system: violet #2E1AC8 + yellow #FFD400 on white, navy #0B1437 dark sections; Plus Jakarta Sans / DM Sans / JetBrains Mono
  - Triple Meta Pixel support via comma-separated REACT_APP_META_PIXEL_ID
- **Assets**: all covers, sample pages, hero flip video (mp4+webm) and the 2 medical PDFs live in frontend/public (downloads/ + samples/)

## Import (2026-09-29)
- Cloned repo → merged into live workspace (backend server/seed/email_service; frontend src, public, craco/tailwind/postcss configs, plugins)
- Installed razorpay==1.4.2 (+ setuptools 80.9.0 into venv — razorpay 1.4.2 imports pkg_resources, dropped in setuptools 84)
- Env rebuilt (was gitignored): backend/.env + EMAIL_FROM_NAME/EMAIL_REPLY_TO/EMERGENT_EMAIL_KEY; frontend/.env + REACT_APP_META_PIXEL_ID=940189282348093,4445400379031726
- SITE_BASE in seed_data.py repointed from old preview domain (guide-central-16) to current preview domain so the medical PDFs' absolute download URLs resolve
- Verified: health, categories, settings, testimonials, product detail, recent-summary, order intent (ORD-… created), contact POST — all 200; 5 products seeded
- Screenshots: home desktop + mobile 390px, /meta-ads-decode desktop — all render, no horizontal overflow, urgency timer ticking

## Blocked / pending
- **Razorpay live keys (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) were in the old workspace's .env only** — not in git. Checkout create-order responds "Payments are not configured" until the owner supplies them. Delivery email + download flow already work server-side.
- ADMIN_KEY unset → admin API disabled by design (set in backend/.env to enable)
- download_urls for the 2 medical PDFs point at the preview domain (SITE_BASE) — repoint when a production domain exists

## User Personas
Students; side-income explorers; beginners in digital business; existing digital-product sellers; small business owners.

## Backlog (P0/P1/P2)
- **P0**: Supply Razorpay live keys; real end-to-end test purchase
- **P1**: Razorpay webhook for server-authoritative paid status; admin UI for products/settings/testimonials; SuperProfile legacy links cleanup
- **P2**: Meta CAPI server-side events; GA measurement id if desired

## Credentials
See /app/memory/test_credentials.md.

## Update (2026-09-29, v17 — Razorpay live + Medical landing page)
- Razorpay LIVE keys set in backend/.env (from owner) — create-order returns real razorpay_order_id (verified: order_…, ₹299 → 29900 paise, key rzp_live_…)
- Full Medical Diseases & Ayurvedic Reference Bundle landing ported from github.com/sagarjoshi3395-commits/Medical-Diseases-Reference-guide-ayurvedic-bundle → new route /medical-reference-bundle (ads destination)
  - Sections: announcement bar + anchor strip, hero (2 covers, floating chips, countdown), sample-pages coverflow with lightbox (disease/medicine tabs), inside-highlights, before/after why-created, bundle cards, disease topics (expandable), medicine categories, how-presented, bilingual (EN+HI), who-for, what-you-receive, educational disclaimer, access steps, pricing (live price from API ₹299/₹1999), FAQ accordion, final CTA, mobile sticky buy bar
  - Buy flow = native Razorpay via BuyerEmailDialog → startRazorpayCheckout (items: medical-reference-bundle); prices read from /api/products/medical-reference-bundle
  - Own teal/navy theme namespaced as Tailwind `mrg-` colors + shadows + scoped CSS (components/medical/) so nothing clashes with the violet site theme
  - Dropped from the source repo: fake "buyers from cities" sales ticker + recent-sales pill (LedgerKit brand rule: no fake sales numbers)
- ProductDetail: dedicated-page link map now routes medical product "View Full Details" → /medical-reference-bundle (meta-ads-decode unchanged)
- Verified: landing desktop+mobile (no overflow, timers ticking), buy flow in browser → email dialog → REAL Razorpay modal at ₹299; product detail link resolves

## Update (2026-09-29, v18 — Add-on offers + price drop, medical landing only)
- Medical Reference Bundle price 299 → 199 (seed_data.py sale_price + editions.digital.price; DB reseeded on restart; regular ₹1999 kept)
- 5 add-on guides seeded as hidden products (is_add_on: True, status published, editions.digital.price set, download_files [] PENDING — owner to supply PDFs):
  ecg-guide ₹99, emergency-guide ₹149, ayurvedic-medicine-guide ₹99, physiotherapy-clinical-guide ₹149, lab-report-guide ₹99 (names/prices per owner; copy referenced from ssphysio.store)
- server.py: /api/add-ons endpoint (sorted by price); list_products + get_product filter is_add_on → add-ons invisible in store & have no standalone page (404), but checkout-able
- Pricing section of /medical-reference-bundle now has Add-On Offers panel: checkbox cards, live total (bundle + add-ons), buy buttons pass items[] to one Razorpay order (server computes total)
- openBuy(withAddOns) flag: hero/sticky/anchor/CTA buttons = bundle only; pricing area buttons include selected add-ons; BuyerEmailDialog total matches
- Verified: bundle ₹199 in DB/API; store list unchanged (5, no add-ons); add-on page 404; combined order 199+99+149=447 → real Razorpay order 44700p; browser: ticking 2 add-ons shows ₹447 total + "Get Bundle + 2 Add-ons — ₹447"

## Update (2026-09-29, v19 — Two-phase buy flow on medical landing)
- CTA buttons outside pricing (hero, anchor strip, sticky mobile bar, final CTA): 1st click smooth-scrolls to #pricing (add-on panel pulses teal ~2s); the NEXT click on any such CTA opens checkout directly — bundle-only ₹199 even if add-ons were ticked ("Get the Complete Guide" buttons keep their labels)
- Pricing-section buttons (main card + add-on panel) pass withAddOns=true and always open the gateway immediately, with or without selections; totals match selection
- Renamed per owner: no-selection buy buttons now read "Get the Order — ₹199" (previously "Get the Bundle"/"Grab it at"); with add-ons: "Get Bundle + N Add-ons — ₹X" / "Checkout — ₹X"
- Verified in browser: click 1 scrolled to pricing (scrollY ≈ section top, no dialog); click 2 opened BuyerEmailDialog at ₹199; add-on totals still correct (₹447 test earlier)

## Update (2026-09-29, v20 — Flowing samples + restructured page order)
- Page order now: Hero → Samples (flowing streams) → Pricing + Add-Ons → What's Inside → Why → Bundle Cards → Topics → Medicine Categories → Format → Bilingual → Who For → What You Receive → Disclaimer → Access Steps → FAQ → Final CTA (examples & pricing pulled to the top per owner)
- SamplePages rebuilt as dual vertical streams (owner request, referenced from reel-style flow): Diseases Reference column on LEFT flowing down, Medicines Reference column on RIGHT flowing up, 40s linear loop (moderate speed), gradient mask fade top/bottom, pause on hover, seamless via duplicated list
- Click-to-zoom REMOVED: Coverflow + Lightbox deleted, stream images pointer-events:none + non-draggable — pages cannot be enlarged/read in detail (owner: users shouldn't read page details)
- Anchor strip order updated (Samples, Pricing, What's Inside, Topics, FAQ); "View Sample Pages" hero anchor unchanged
- Verified: streams render desktop + mobile 390px (2-up), no overflow, section order samples→pricing→inside→bundle→topics→faq, click on stream image does nothing (no lightbox element exists)

## Update (2026-09-29, v21 — Sample section rebuilt as stacked horizontal flow rows)
- Owner shared masterybooks.in reference → SamplePages rebuilt: TWO horizontal flowing rows stacked vertically (no side-by-side columns)
  - Row 1: "Section 01 · Disease Guide — Diseases & Clinical Conditions" — disease pages flow LEFT
  - Row 2: "Section 02 · Medicine Guide — Medicines Reference" — medicine pages flow RIGHT (opposite direction)
  - Each page card has a caption (English title · Hindi) below it, like the reference
  - Speed 42s linear loop (moderate), edge fade masks, pause on hover, seamless 2x duplication
- Click-to-enlarge still removed (pointer-events none, no lightbox) per owner: users must not read page details
- Bug fixed: earlier insert_text had split the .mrg-eyebrow rule (keyframes injected mid-declaration) → .mrg-flow-row never applied (rows rendered as stacked blocks); CSS repaired and frontend restarted
- Verified: .mrg-flow-row computed flex/3632px/mrgFlowLeft; rows render desktop + mobile 390px, no overflow; captions present; order Samples → Pricing unchanged

## Update (2026-09-29, v22 — Live totals on all CTA buttons)
- All page CTAs now display AND charge the live total (bundle + ticked add-ons): sticky mobile bar, hero, anchor strip, final CTA — e.g. "Get the Complete Guide · ₹199" → "· ₹447" the moment add-ons are ticked (verified in browser)
- Checkout context simplified: openBuy always includes selectedAddOns in items; includeAddOns state removed; BuyerEmailDialog total always = live total
- Two-phase kept: hero/anchor/sticky first click → pricing scroll, next click → checkout; FinalCta (below pricing) goes straight to checkout
- Server-side charge already verified (₹447 = 199+99+149 order created via live Razorpay keys)
