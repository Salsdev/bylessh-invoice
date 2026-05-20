# Bakery Invoice Generator

A **mobile‑first**, local‑first invoice builder for bakeries. Replace tedious Canva drag‑and‑drop with a 10‑second form that auto‑saves to your browser, calculates totals in Naira, and exports perfect PDFs or PNGs.

## Features

- **Mobile‑first UI** – Tabbed interface (`Form` / `Preview`) works flawlessly on phones. On desktop, side‑by‑side layout.
- **Live preview** – See the invoice update instantly as you type.
- **Auto‑save** – Every keystroke saved to `localStorage`. Close the tab? No data loss.
- **One‑click export** – PDF (native print), PNG image, or direct print.
- **Zero backend** – Runs entirely in the browser.

## Tech Stack

- Next.js (App Router)
- Zustand (state + persistence)
- Tailwind CSS (mobile‑first utilities)
- html-to-image (PNG export)

## Getting Started

```bash
npm install
npm run dev