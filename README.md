# Bylessh — Premium Invoice Builder

A mobile-first, high-end invoice builder designed for artisanal bakeries and premium boutique brands. It replaces tedious manual editing with an elegant 10-second workspace that automatically handles financial calculations, saves drafts locally, and compiles pristine, print-ready documents in a single click.

---

## 🚀 Key Features

* **Signature Design Aesthetics:** Features curated brand accents (signature terracotta `#955647`, warm ivories, and charcoal inks) using elegant modern typography (Inter) paired with classical cursive branding (Great Vibes).
* **Decoupled Architecture:** Built on a strict separation of concerns—a centralized Zustand store for rapid state mutations, independent atomic form sections, and a pure presentational preview sheet.
* **Granular Re-render Boundaries:** Store selectors are used at the input level to isolate DOM updates, resulting in buttery-smooth 60fps input typing even on budget mobile devices.
* **Production-Grade PDF Exporter (Highly Optimized):**
  * **Direct Downloads:** Instantly compiles and downloads documents in the background without launching slow browser print dialogs.
  * **95%+ File Size Reduction:** Captures a high-resolution 2x JPEG (~300 DPI Retina clarity) at 92% quality and compresses it internally using Flate encoding, shrinking output PDF weights from **10.4MB down to under 500KB** with zero visual loss.
  * **Smart Single Page Scale-to-Fit:** Employs a 35mm tolerance filter to scale down minor overflows automatically, ensuring standard 1-item to 5-item invoices stay perfectly whole on exactly one A4 page.
  * **Automated Page Numbering:** Programmatically writes muted brand terracotta `Page X of Y` footers at the bottom of every sheet for multi-page documents.
* **Ultra-Crisp PNG Exporter:** Uses `html-to-image`'s same-origin data URL compiler to inline fonts and graphics, keeping the canvas untainted and preventing browser security crashes (`SecurityError`) during a crisp 3x export.
* **Auto-Save & Persistence:** State automatically synchronizes to `localStorage` on every keystroke for seamless draft preservation.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, offline font pre-caching)
* **Styling:** Tailwind CSS (mobile-first composition, custom HSL variables)
* **State Management:** Zustand (lightweight actions + reactive slices)
* **Image Capture:** `html-to-image` (headless vector-to-raster serializer)
* **PDF Engine:** `jsPDF` (binary client-side document compiler)

---

## 📂 Codebase Architecture

The directory layout enforces clean boundary separation to maximize extensibility:

```
├── app/
│   ├── layout.tsx         # Root layout, Google Font loaders, mobile viewport config
│   ├── page.tsx           # Home entry point, hooks up store hydration
│   └── globals.css        # Tailwind tokens, brand variables, print media rules
├── store/
│   └── invoice-store.ts   # Zustand store, financial derived selectors, localStorage sync
├── components/
│   ├── invoice-builder.tsx # Core page wrapper (orchestrates forms & live preview)
│   ├── invoice-form.tsx    # Aggregator of atomic input categories
│   ├── invoice-preview.tsx # Simulated A4 presentational sheet (referenced via paperRef)
│   ├── export-dropdown.tsx # Encapsulated PDF, PNG, and Print action engines
│   └── form-sections/      # Atomic, decoupled input field groups
│       ├── business-details.tsx
│       ├── customer-details.tsx
│       ├── invoice-details.tsx
│       ├── order-items.tsx
│       └── notes-terms.tsx
```

---

## 💻 Developer Guide

### Getting Started

Clone the repository and install the dependencies:

```bash
# Install packages
npm install

# Start the local development server
npm run dev

# Run TypeScript type-checking
npx tsc --noEmit
```

### Extending the Codebase

#### 1. Adding a New State Field
To add a new invoice property (such as `taxRate` or `shippingFee`):
1. Update the Zustand store types and initial state inside `store/invoice-store.ts`.
2. Create your mutation action (e.g. `setShippingFee`).
3. Consume the new state directly inside your form components and invoice preview using store selectors:
   ```typescript
   const shipping = useInvoiceStore((state) => state.shippingFee);
   ```

#### 2. Creating custom themes or visual presets
To add different invoice visual presets (e.g. "Minimalist Black", "Modern Teal"):
1. Declare a `theme` state inside your store.
2. In `components/invoice-preview.tsx`, bind conditional CSS variables or utility styles based on the active theme.
3. The `ExportDropdown` ref engine will automatically render and print the selected visual style with no changes required.