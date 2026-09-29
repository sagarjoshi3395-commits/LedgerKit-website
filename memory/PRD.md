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
