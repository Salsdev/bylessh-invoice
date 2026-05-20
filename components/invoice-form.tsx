"use client";

import { useInvoiceStore } from "@/store/invoice-store";
import InvoiceDetails from "./form-sections/invoice-details";
import CustomerDetails from "./form-sections/customer-details";
import OrderItems from "./form-sections/order-items";
import DiscountSection from "./form-sections/discount-section";
import NotesTerms from "./form-sections/notes-terms";
import BusinessDetails from "./form-sections/business-details";

export default function InvoiceForm({
  isMobile,
}: {
  isMobile?: boolean;
}) {
  const reset = useInvoiceStore((state) => state.reset);

  return (
    <aside
      className={`bg-surface border-r border-line flex flex-col overflow-y-auto print:hidden ${isMobile ? "w-full h-full" : "w-[360px] min-w-[360px]"
        }`}
    >
      {/* ── Header ── */}
      <div className="px-4 py-3.5 bg-brand-dark flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-[11px] font-bold tracking-[0.1em] uppercase text-brand-light md:text-[11px] text-xs">
          Invoice Builder
        </h1>
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              if (window.confirm("Clear all order data?")) reset();
            }}
            className="bg-white/15 text-white border border-white/30 px-2.5 py-1.5
              rounded text-[10px] font-semibold cursor-pointer
              hover:bg-white/25 transition-colors
              md:px-2.5 md:py-1.5 px-3 py-2 active:scale-95"
          >
            Clear
          </button>
        </div>
      </div>

      <InvoiceDetails />
      <CustomerDetails />
      <OrderItems />
      <DiscountSection />
      <NotesTerms />
      <BusinessDetails />

      {/* Bottom spacing for mobile nav bar */}
      {isMobile && <div className="h-2" />}
    </aside>
  );
}
