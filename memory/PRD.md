# PRD — Decode Digital Products Storefront

## Original Problem Statement
Build a complete, premium, conversion-focused digital-product ecommerce website for the user's brand, selling downloadable guides/ebooks/templates. Flagship product: **Meta Ads Decode Guide** — a digital-product + Meta Ads execution guide positioned around "3 Years of Practical Experience → One Complete Guide", sold in 3 editions: Digital ₹299 (instant access), Physical ₹899 (shipped), Bundle (price TBA by user). Hard rules: no fake testimonials, sales numbers, countdowns, trust badges or income claims; mobile-first; data-driven product architecture; Razorpay/SuperProfile-ready checkout via configurable per-edition checkout URLs; full legal page set; SEO + tracking readiness.

## Architecture
- **Backend** (FastAPI + MongoDB): `/app/backend/server.py` + `/app/backend/seed_data.py`
  - Collections: products, categories, testimonials, orders, contact_messages, settings
  - Endpoints: GET /api/products (search/category/sort/featured), GET /api/products/{slug}, GET /api/categories, GET /api/settings, GET /api/testimonials, POST /api/contact, POST /api/orders (order intent → returns edition checkout_url), GET /api/orders/{id}, GET /api/orders/recent-summary (genuine paid count only), POST /api/admin/products (requires ADMIN_KEY env + x-admin-key header)
  - Product doc is fully data-driven: editions (digital/physical/bundle with own price + checkout_url), curriculum, sample_pages, faqs, who_for, not_for, bonuses, whats_included, offer_end (real countdown only), featured/is_new/bestseller flags
- **Frontend** (React + Tailwind + framer-motion): pages Home, /products, /products/:slug, /meta-ads-decode, /about, /contact, /faq, /legal/:slug (6 policies), /order-success, /admin
  - Legal copy: `/app/frontend/src/lib/legalContent.js` (editable, [PLACEHOLDERS] highlighted in amber)
  - Site copy/nav/footer: `/app/frontend/src/lib/siteContent.js`
  - Tracking: `/app/frontend/src/lib/analytics.js` — Meta Pixel via REACT_APP_META_PIXEL_ID, GA via REACT_APP_GA_MEASUREMENT_ID (auto-injected in public/index.html); events PageView/ViewContent/InitiateCheckout; UTM capture + passthrough to checkout
  - SEO: Seo.jsx (title/meta/OG/canonical/JSON-LD Product+FAQ), public/sitemap.xml, public/robots.txt
- **Design system**: Swiss/editorial — light #FAFAFA base, obsidian #090D16 conversion sections, ember #EA580C accent; Plus Jakarta Sans display / DM Sans body / JetBrains Mono labels

## User Personas
Students; side-income explorers; beginners in digital business; existing digital-product sellers; small business owners.

## Implemented (2026-09-16)
- Home page: hero, featured product with sample previews, 4 value cards, dynamic product grid, horizontal "Learn Visually" gallery, why-different cards, auto-hiding testimonials, full-width CTA
- /meta-ads-decode landing: dark hero w/ CSS 3D book mockup + floating framework cards, info chips, experience marquee strip, "3 Years of Doing" section, problem section, animated 16-step workflow, real-world screenshot upload slots, interactive sample-page viewer (10 placeholder slots), what's included, 16-part curriculum accordion (13 parts + bonus + case studies + closing), visual tools, who-for (5 segments), what-it's-not, bonus toolkit, 3 case-study cards, 3-edition SaaS pricing + comparison table + genuine savings calc, physical-book photo slots, checkout trust, product FAQ, final CTA, sticky mobile buy bar (scrolls to editions, reflects selected edition), gentle desktop exit-intent, recent-purchase notice (hidden — 0 genuine paid orders)
- /products store: search, 8 category filters, sort, count, badges (New/Featured; Bestseller only if flagged)
- Reusable product detail template (/products/:slug) with Product JSON-LD
- Legal: Terms, Privacy, Refund & Cancellation (digital/physical/bundle separated), Shipping & Delivery, Digital Delivery, Disclaimer — all footer-linked with editable highlighted placeholders
- About, Contact (working form → DB, topic select, placeholder business info), FAQ (with FAQ JSON-LD), Order Success (honest: shows "Order Received" until server-side payment confirmation), Admin add-product form
- Seeded Meta Ads Decode product with full curriculum, FAQs, editions

## Verified
- curl: health, product list/detail, filtered/sorted search, order intent (ORD-… created, empty checkout_url → frontend toast), contact POST, recent-summary=0, admin 503 without key
- Screenshots: home hero, decode hero/workflow/pricing/curriculum accordion, mobile 390px hero + sticky bar scroll-to-editions, products store search, contact form submit (toast confirmed), refund policy page

## Update (2026-09-16, v2 — per user request)
- Brand renamed to **LedgerKit** everywhere (logo, settings, SEO, legal, about, FAQs); support = ledgerkitsupport@gmail.com only (phone removed)
- Digital-only: physical book + bundle editions removed everywhere; shipping policy page removed; ₹1699 regular → ₹299 launch price with auto savings (82% / ₹1,400)
- Buy buttons direct-redirect to SuperProfile checkout: https://superprofile.bio/vp/6aab089e0cce8b001386b6f9 (order intent still recorded server-side; UTMs preserved)
- Real launch countdown (offer_end = 2026-09-30 23:59 IST, editable in seed_data.py) shown at pricing + sticky bar; auto-hides after expiry
- Fixed bottom checkout bar on ALL screens (price + timer + Buy Now direct redirect)
- City-based purchase popups (PurchaseNotifications.jsx, config PURCHASE_PINGS in lib/siteContent.js — set enabled:false to disable; auto-switches to verified mode when genuine paid orders exist)
- Hero repositioned: "Build Digital Products. Learn to Scale Them." + real Ads Manager dashboard page behind book mockup; copy now emphasizes complete digital-product guide with Meta Ads examples inside
- Sample pages: 5 real book pages (user-provided, in /public/samples/) shown as auto-scrolling flow strip (hover to pause, tap to open preview dialog) — rest of pages kept exclusive
- "What This Guide Is Not" reframed to positive "Go In With the Right Expectations"

## Update (2026-09-16, v3 — per user request)
- Product renamed to **Digital Product Sales Engine** (short: "Sales Engine") — title, nav, footer, SEO, testimonials label all updated; route stays /meta-ads-decode
- Countdown is now a 10-minute per-visitor urgency timer (lib/offerTimer.js, localStorage deadline set once, never resets; price unchanged after expiry — timer just hides). Shown at pricing + sticky bar (MM:SS)
- Real book cover (transparent PNG) replaces CSS mockup everywhere via BookMockup coverImage prop; hero shows real "Performance Dashboard (Real Data)" image tilted behind cover + floating framework cards; cover also shows on mobile hero
- Sample flow: 6 real pages, bigger cards (tilted alternating), moved to middle of page (after Problem section); Real-World Learning section removed
- New AspirationSection ("Imagine Knowing Exactly What to Do Next") — hope/aspiration without income claims
- 3 seeded testimonials now render (seed_data.py TESTIMONIALS — placeholders to replace with genuine reviews)
- Purchase ping redesigned: dark card + cover thumbnail + spring slide-in + live dot
- Order-success page: "Download Now" button (uses product.download_url when configured, else honest email-delivery toast). SuperProfile after-payment redirect must be set in SuperProfile dashboard → /order-success
- Mobile scroll shake fixed: overflow-x clip on html/body; address removed from footer/contact/terms

## Update (2026-09-17, v4 — re-theme + real assets)
- Full design re-skin to match the book's own identity: violet #2E1AC8 + yellow #FFD400 on white, navy #0B1437 dark sections (orange palette swapped to a `brand` Tailwind palette; yellow brush highlights)
- Hero rebuilt: light editorial layout with the real cover poster (hero-cover.png) large on desktop AND mobile — fixes short-mockup/black-space complaint; rotated poster card with yellow sticky-note + navy badge accents; violet marquee strip with yellow text
- Case Studies section now shows the 3 real campaign breakdowns (case-campaign / case-adset / case-adlevel JPEGs)
- Verified: mobile no horizontal overflow (scrollWidth == innerWidth), timer MM:SS, ping design, home + pricing in new palette

## Update (2026-09-17, v5 — bump offers + bundle)
- 3 new products seeded: AI Business Ideas Guide 2026 (₹199), ChatGPT Prompt Guide (₹149), Complete Business Bundle (₹499, strike ₹647, genuine "You Save ₹148")
- New "Add These to Your Order" bump-offer section on the Sales Engine page (after pricing): 2 add-on cards with CSS mini covers + highlighted bundle card showing all 3 covers together
- All 4 products live in the /products store with search/filter; each new product gets its auto product page
- New products' checkout_url fields are EMPTY — need SuperProfile payment links from user (buttons show honest "not connected" toast until then); main guide checkout unchanged

## Update (2026-09-17, v6 — bump ticks + bundle popup + covers)
- Real covers wired: AI Ideas (ai-ideas-cover.png), Prompt Guide (prompt-guide-cover.png), Bundle trio (bundle-covers.png), main guide (sales-engine-cover.png) — store cards, bump section, bundle visual all use them
- Bundle checkout_url set: https://superprofile.bio/vp/6aabaf99aa63460013c9c19f
- Pricing card now has "Bump Offer — Tick to Add" checkboxes (AI ₹199 / ChatGPT ₹149); CTA total updates live
- Tick flow: any tick + buy → bundle offer modal (trio image, highlighted "Get the Bundle Offer — ₹499" → bundle link); "Continue without offer" → combo link: main+ChatGPT = ...7b7a66, main+AI = ...7ba85a (stored in product.combo_checkout_urls); both ticked + decline → falls back to main-only link; no ticks → main link direct
- All 3 redirect paths browser-verified (SuperProfile shows a Vercel bot-check only to headless test browsers — normal for real visitors)
- NOTE: standalone AI-guide-only and Prompt-guide-only payment pages don't exist yet — their store/bump card buttons show "not connected" until user creates those SuperProfile pages (or points them at combo links)

- Sticky bottom bar now has a one-tap Guide (₹299) / Bundle (₹499, "Save More" badge) switch; Buy Now label + redirect follow the selection (bundle → ...9c19f link). Mobile-verified, no overflow

- v6b restructure: toolkit section is now bundle-only (wide 2-col showcase card, savings auto-calc); individual add-on cards removed from it (products still live in /products store); slim bundle banner added directly below the pricing card in the Launch Offer section (redirects to bundle link); bump ticks now have small sub-descriptions (ChatGPT: "Product research, ebook creation, landing pages to ads")

- v7 polish: all images converted to WebP (13MB → 1.3MB total, hero 1.6MB→160KB, fetchpriority=high on hero); 10-min timer chips added near hero CTAs and above the pricing card Buy button (pulsing dot); hero engagement: spinning yellow circular badge (₹299 / 3 YEARS EXPERIENCE) + hand-drawn arrow pointing to poster; legal "Last updated" set to 17 September 2026; support email (ledgerkitsupport@gmail.com) added to checkout trust + FAQ note; no address/phone anywhere on site

- v8: timer expiry state decided & verified — when a visitor's 10-minute deadline ends, all timers (hero chip, pricing card chip, big countdown, sticky bar) hide cleanly and the price stays ₹299; deadline is stored once per visitor and never resets (no fake scarcity loop)

## Update (2026-09-17, v9 — hero flip-through video)
- New muted, auto-playing, looping hero video on the Sales Engine landing (/meta-ads-decode): `/public/samples/hero-flip.mp4` (1.75MB h264, 760×1074, 30fps, 18s) + `hero-flip.webm` (2.4MB VP9 fallback for Chromium/Firefox without h264)
- Built frame-by-frame from the real assets with PIL+ffmpeg (imageio-ffmpeg binary): cover → 7 interior sample pages → dashboard → crossfade back to cover (seamless loop); slide-left page-turn transitions with smoothstep easing + subtle Ken Burns zoom on holds
- DecodeHero.jsx: static cover <img> replaced with <video autoPlay muted loop playsInline poster=hero-cover.webp> (mp4 source first, webm fallback, img fallback inside); same rounded card, shadow, spin badge, sticky note, data-testid kept
- NOTE: headless test Chromium decodes video extremely slowly (environment CPU throttling — verified with tiny test clip); plays at full speed in real browsers

## Update (2026-09-18, v10 — native Razorpay checkout)
- Replaced all SuperProfile external redirects with native Razorpay Checkout across every buy path (CheckoutButton, StickyBuyBar, PricingEditions bump/combo/bundle flows, DecodeAddons, ProductDetail)
- Backend (server.py): razorpay SDK client (guarded on env); POST /api/checkout/create-order (accepts items[], computes total server-side from DB prices, creates Razorpay order, stores Order with items[]+razorpay_order_id, status payment_pending, provider razorpay) → returns order_id, razorpay_order_id, amount(paise), key_id, name, description; POST /api/checkout/verify (verify_payment_signature → marks order paid + razorpay_payment_id + paid_at; bad signature → 400 + payment_failed; unknown order → 404)
- Frontend: new lib/razorpay.js (loads checkout.js, calls create-order, opens modal with theme #2E1AC8, verifies, redirects /order-success?order_id=). Amount + key_id come from backend — nothing hardcoded in frontend
- Keys in backend/.env: RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET (LIVE keys — real charges). Combo_checkout_urls / SuperProfile URLs in product data are now unused (kept but ignored; multi-item totals handled by Razorpay directly)
- Backend fully tested (create-order single/multi/bundle math, 404/400 edge cases, signature-rejection) — all pass. Frontend payment NOT auto-tested (live keys = real money); Razorpay script injection verified in-browser. Real end-to-end purchase needs a live test by the owner.
- NEXT: Razorpay webhook (/api/webhook + RAZORPAY_WEBHOOK_SECRET) for server-authoritative paid status; email/download delivery on paid; capture buyer email into order


## Update (2026-09-18, v11 — Resend product delivery on payment)
- After Razorpay signature is verified (order -> paid), backend now emails the buyer their digital product automatically via Emergent-managed email (Resend proxy). No Resend key/domain needed — platform-managed.
- New backend/email_service.py: playbook guardrail gate (_assert_safe_email, G2/G3) + async send_email (httpx, non-blocking, never raises) + build_delivery_email server-side template (LedgerKit brand header, order ref, amount, per-guide Download buttons, support reply-to, security footer)
- verify endpoint: fetches buyer email via razorpay_client.payment.fetch(), stores email on order, sends delivery email, records delivery_status(sent/pending)+delivered_to. Bundle purchase auto-expands to the 3 included guides' download links (BUNDLE_PART_SLUGS). Email failure never blocks the paid result.
- .env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME="LedgerKit", EMAIL_REPLY_TO=ledgerkitsupport@gmail.com. email_service loads its own .env (avoids load_dotenv timing bug). requirements: httpx.
- Tested: send_email to delivered@resend.dev returned a provider id (proxy works); gate passes on the template. End-to-end (real payment) not auto-tested (live keys).
- BLOCKER for real delivery: every product download_url is empty. Owner must provide the hosted https link to each product's file (or upload the PDFs) so the email carries the actual product. Until then buyers get a "your access link is being prepared" delivery email.

## Update (2026-09-19, v12 — buyer email capture + real PDF delivery)
- New BuyerEmailDialog (components/BuyerEmailDialog.jsx): branded email-capture step before Razorpay on every buy path (CheckoutButton, StickyBuyBar, PricingEditions). Validated input, remembered via localStorage (lk_buyer_email), pre-fills Razorpay, shows live total. Native + custom validation.
- Email flows into create-order → stored on order → verify fetches payer email from Razorpay payment as authoritative fallback → delivery email sent to it.
- lib/razorpay.js: create-order + checkout.js load now run concurrently (faster modal, order created even if CDN is slow).
- meta-ads-decode download_url = user-provided PDF (Digital Product Mastery Decode Ebook.pdf, 35MB, hosted artifact URL) → delivery email Download button + /order-success Download Now both serve the real guide. Bundle expands to the 3 guides.
- Verified: dialog UI + validation in browser, email in create-order payload, email stored in DB (curl), full _deliver_products pipeline → HTTP 202 from email proxy with real PDF link.
- STILL PENDING: download_url for ai-business-ideas-2026 + chatgpt-prompt-guide (user to provide PDFs).

## Update (2026-09-19, v13 — Meta Pixel connected)
- REACT_APP_META_PIXEL_ID=3470309736541129 added to frontend/.env (mechanism pre-existed in public/index.html: snippet inits pixel + tracks PageView when the env var is set)
- Verified live in-browser: fbevents.js fetched from connect.facebook.net, fbq.loaded=true, version 2.9.403, event queue processed (init + PageView sent)
- Event funnel now complete: PageView (all pages) → ViewContent (product views) → InitiateCheckout (fires on "Continue to Payment" in the email dialog) → Purchase (NEW: fires once on /order-success when order status = paid, with value/currency/order_id/UTMs — OrderSuccess.jsx)
- Note: after deploys the platform rewrites REACT_APP_BACKEND_URL in frontend/.env — the pixel var must be re-added if .env is regenerated (verify after each deploy)

## Update (2026-09-19, v14 — all 3 PDFs live + per-product download page)
- download_url wired for all 3 guides (ai-business-ideas-2026 + chatgpt-prompt-guide artifacts added; meta-ads-decode already done) — every product + the bundle now delivers real files
- Backend: new _resolve_downloads(order) expands a paid order's items to actual guides (bundle → 3 parts, dedup) returning {slug,title,download_url,cover_image}; shared by delivery email AND GET /api/orders/{id} (adds `downloads` list, only when paid/delivered)
- OrderSuccess.jsx redesigned: after payment the customer sees a per-product download card (cover + title + direct Download button opening the real PDF) for everything they bought; polls every 4s until paid; Meta Purchase event still fires once; email copy still sent in parallel
- Verified end-to-end: bundle order → API returns 3 downloads all with real URLs → page renders 3 download cards with correct PDF links + covers; single order → 1 download; delivery email HTTP 202 for both
- Result: buyer both (a) lands on site and downloads directly, and (b) gets the same links by email via Resend — exactly as requested

## Update (2026-09-20, v15 — Medical/Ayurvedic bundle product + 2-file delivery + sticky bump fix)
- Added new product "Medical Diseases & Ayurvedic Reference Bundle" (slug medical-reference-bundle, ₹299 / regular ₹1999) ported from user's now-public GitHub repo. 2 PDFs (Diseases Reference Book 21MB + Medicine Reference Guide 8.5MB) → /app/frontend/public/downloads/; 2 covers → /samples/*.webp. New "health" category ("Health & Reference"); category seeding now upserts each (was only-if-empty).
- Multi-file delivery: products can carry download_files:[{title,url}]. _resolve_downloads expands them so both PDFs appear as separate download cards on /order-success AND as separate Download buttons in the Resend email. Verified: resolves to 2 downloads, delivery HTTP 202.
- Fixed who_for schema ({title,text}) so the product page renders proper bullets.
- Frontend testing agent: PASS — store lists 5 products + Health filter; product page price/copy/buy; buy → email dialog → create-order 200 → Razorpay modal (no real pay); order-success shows both PDF download cards with correct https .pdf hrefs.
- Bug fixes verified same session (v earlier): sticky-bar Buy Now shows bundle bump offer first (Guide Only), and email input set to 16px to stop mobile auto-zoom/shake.
- NOTE (deploy): the medical PDFs/covers are served from the app's own /downloads & /samples paths with absolute preview-domain URLs in seed_data SITE_BASE — update SITE_BASE if the production domain differs, or the emailed/download links for this product will point at the preview domain.

## Update (2026-09-20, v16 — triple Meta Pixels)
- User asked to add Pixel 940189282348093 while keeping the old one (3470309736541129), then added a third dataset ID 4445400379031726 — all fire simultaneously.
- REACT_APP_META_PIXEL_ID is comma-separated ("940189282348093,4445400379031726" — old pixel 3470309736541129 removed per user request); public/index.html splits the list and calls fbq("init", id) per ID before a single PageView. All analytics.js events (ViewContent/InitiateCheckout/Purchase) flow through window.fbq → fire to ALL pixels automatically.
- Verified live in-browser: signals/config requests sent ONLY for the 2 remaining pixel IDs; old pixel no longer fires.


- **P0**: Configure real per-edition checkout URLs (SuperProfile) in product data; set bundle price; set ADMIN_KEY in backend/.env; replace [PLACEHOLDER] business details (support email/phone/address, refund/shipping timelines); upload real sample pages, Ads Manager screenshots, physical-book photos
- **P1**: Direct Razorpay integration (create order → checkout → server-side signature verify → paid status → delivery email → /order-success); customer download/access flow; admin UI for editing products/settings/testimonials; real testimonials once collected
- **P2**: Meta CAPI server-side events, offer countdown config, physical order shipping status tracking in admin

## Credentials
- No user-facing auth. Admin product API requires ADMIN_KEY env var (currently unset → admin disabled by design). See /app/memory/test_credentials.md.
