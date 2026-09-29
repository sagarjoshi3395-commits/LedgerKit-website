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
