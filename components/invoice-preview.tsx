"use client";

import { forwardRef, useRef, useState, useEffect } from "react";
import { useInvoiceStore } from "@/store/invoice-store";
import { fmt, prettyDate } from "@/lib/utils";
import { LOGO_SRC } from "@/lib/logo";
import ExportDropdown from "@/components/export-dropdown";

const InvoicePaper = forwardRef<HTMLDivElement>(
  (_, ref) => {
    const biz = useInvoiceStore((state) => state.biz);
    const inv = useInvoiceStore((state) => state.inv);
    const customer = useInvoiceStore((state) => state.customer);
    const items = useInvoiceStore((state) => state.items);
    const notes = useInvoiceStore((state) => state.notes);
    const discount = useInvoiceStore((state) => state.discount);
    const getTotals = useInvoiceStore((state) => state.getTotals);

    const { sub, discAmt, total } = getTotals();
    const discPct = parseFloat(discount) || 0;
    const filled = items.filter((i) => i.name || i.price);

    return (
      <div
        ref={ref}
        className="bg-white w-full max-w-[540px]
          shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-line-light/50
          print:shadow-none print:max-w-none print:w-full"
      >
        {/* ── Letterhead ── */}
        <div className="bg-white flex justify-between items-center border-b border-line-light px-7 pt-[22px] pb-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            alt="bylessh logo"
            className="object-contain block h-32 w-auto print:h-32 print:w-auto"
          />
          <div className="text-brand leading-[1.9] shrink-0 text-[9.5px] text-right max-w-[155px]">
            {biz.phone && <div>{biz.phone}</div>}
            {biz.email && <div>{biz.email}</div>}
            {biz.address && <div>{biz.address}</div>}
          </div>
        </div>

        {/* ── Brand Stripe ── */}
        <div className="bg-brand-dark flex justify-between items-center px-7 py-2.5">
          <div className="font-extrabold text-white tracking-[0.28em] uppercase text-sm">
            Invoice
          </div>
          <div className="text-white/90 leading-[1.9] text-[9.5px] text-right">
            <strong>{inv.number}</strong>
            <br />
            Issued: {prettyDate(inv.date)}
            <br />
            Due: {prettyDate(inv.due)}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-7 py-[22px]">
          {/* Bill To */}
          <div>
            <div className="text-[8.5px] font-extrabold tracking-[0.14em] uppercase text-brand mb-1.5">
              Bill To
            </div>
            {customer.name ? (
              <>
                <div className="font-bold text-ink text-[13px]">
                  {customer.name}
                </div>
                <div className="text-ink-muted leading-[1.85] mt-0.5 text-[10.5px]">
                  {customer.phone && <span>{customer.phone}</span>}
                  {customer.phone && customer.email && <span> · </span>}
                  {customer.email && <span>{customer.email}</span>}
                  {customer.address && <div>{customer.address}</div>}
                </div>
              </>
            ) : (
              <div className="text-[11px] text-ink-placeholder italic">
                Customer details will appear here…
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-none border-t border-line-light my-[18px]" />

          {/* ── Items Table ── */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[8.5px] font-extrabold tracking-[0.1em] uppercase text-brand pb-2 pr-1.5 border-b-[1.5px] border-line text-left">
                  Item / Description
                </th>
                <th className="text-[8.5px] font-extrabold tracking-[0.1em] uppercase text-brand pb-2 px-1.5 border-b-[1.5px] border-line text-center">
                  Qty
                </th>
                <th className="text-[8.5px] font-extrabold tracking-[0.1em] uppercase text-brand pb-2 px-1.5 border-b-[1.5px] border-line text-right">
                  Unit Price
                </th>
                <th className="text-[8.5px] font-extrabold tracking-[0.1em] uppercase text-brand pb-2 pl-1.5 border-b-[1.5px] border-line text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {filled.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-[11px] text-ink-placeholder italic text-center py-5"
                  >
                    Add items to see them here…
                  </td>
                </tr>
              ) : (
                filled.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-line-faint align-top"
                  >
                    <td className="py-2.5 pr-1.5">
                      <div className="text-xs font-bold text-ink">
                        {item.name || "—"}
                      </div>
                      {item.desc && (
                        <div className="text-[9.5px] text-ink-faint mt-0.5 leading-[1.5]">
                          {item.desc}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-1.5 text-center text-xs text-[#5a3020]">
                      {item.qty}
                    </td>
                    <td className="py-2.5 px-1.5 text-right text-[11.5px] text-[#5a3020]">
                      {fmt(Number(item.price) || 0)}
                    </td>
                    <td className="py-2.5 pl-1.5 text-right text-[11.5px] font-bold text-ink">
                      {fmt(
                        (Number(item.qty) || 0) * (Number(item.price) || 0)
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ── Totals ── */}
          <div className="flex mt-[18px] justify-end">
            <div className="w-[200px]">
              <div className="flex justify-between text-ink-muted py-1 text-[11.5px]">
                <span>Subtotal</span>
                <span>{fmt(sub)}</span>
              </div>
              {discPct > 0 && (
                <div className="flex justify-between text-[#c05828] py-1 text-[11.5px]">
                  <span>Discount ({discPct}%)</span>
                  <span>− {fmt(discAmt)}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-extrabold text-brand border-t border-brand/20 pt-4 mt-2 text-xl">
                <span>Total Due</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          {(notes || biz.acct) && (
            <div className="mt-[18px] pt-4 border-t border-line-light">
              <div className="text-[8.5px] font-extrabold tracking-[0.14em] uppercase text-brand mb-1.5">
                Notes
              </div>
              {notes && (
                <div className="text-ink-faint leading-[1.85] whitespace-pre-line text-[9.5px]">
                  {notes}
                </div>
              )}
              {biz.acct && (
                <div className="bg-surface-warm border-l-[3px] border-brand/30 py-2.5 px-3 rounded-r text-ink font-semibold mt-2.5 text-[10px]">
                  Payment: {biz.acct}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="bg-brand-light border-t border-line px-7 py-3.5 text-center">
          <div className="text-[9px] text-brand tracking-[0.14em] uppercase font-bold flex items-center justify-center gap-1.5">
            {biz.name.toLowerCase() === "bylessh" ? (
              <span className="font-signature pb-0.5">{biz.name}</span>
            ) : (
              <span>{biz.name}</span>
            )}
            <span>· {biz.tagline}</span>
          </div>
        </div>
      </div>
    );
  }
);
InvoicePaper.displayName = "InvoicePaper";

export default function InvoicePreview({
  isMobile,
  paperRef,
}: {
  isMobile?: boolean;
  paperRef: React.RefObject<HTMLDivElement | null>;
}) {
  const exportPaperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scaledWrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [paperHeight, setPaperHeight] = useState(0);

  // On mobile, scale the desktop-style paper to fit the viewport width
  useEffect(() => {
    if (!isMobile) return;

    const PAPER_WIDTH = 540; // natural desktop paper width in px

    // Observe container width to calculate scale
    const containerEl = containerRef.current;
    if (containerEl) {
      const resizeObs = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const availableWidth = entry.contentRect.width;
          setScale(Math.min(1, availableWidth / PAPER_WIDTH));
        }
      });
      resizeObs.observe(containerEl);

      // Observe the paper element's height (it may change as content updates)
      const paperEl = scaledWrapperRef.current;
      if (paperEl) {
        const paperObs = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setPaperHeight(entry.contentRect.height);
          }
        });
        paperObs.observe(paperEl);

        return () => {
          resizeObs.disconnect();
          paperObs.disconnect();
        };
      }

      return () => resizeObs.disconnect();
    }
  }, [isMobile]);

  return (
    <main
      className={`flex-1 overflow-y-auto flex flex-col items-center
        print:p-0 print:bg-white print:h-auto print:overflow-visible ${
          isMobile ? "pb-3" : "p-5 gap-3"
        }`}
    >
      {/* ── Preview header (desktop only) ── */}
      {!isMobile && (
        <div className="w-full max-w-[540px] flex items-center justify-between print:hidden">
          <div className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-ink-faint">
            Live Preview — &quot;Download PDF&quot; to print
          </div>
          <ExportDropdown paperRef={paperRef} variant="compact" />
        </div>
      )}

      {isMobile ? (
        <>
          {/* Mobile: full-width scaled desktop paper */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden"
            style={{
              height: paperHeight ? paperHeight * scale : "auto",
            }}
          >
            <div
              ref={scaledWrapperRef}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: 540,
              }}
            >
              <InvoicePaper ref={exportPaperRef} />
            </div>
          </div>

          {/* Mobile: Export dropdown at bottom of preview */}
          <div className="px-3 w-full">
            <ExportDropdown paperRef={exportPaperRef} variant="full" />
          </div>
        </>
      ) : (
        /* Desktop: standard paper */
        <InvoicePaper ref={paperRef} />
      )}
    </main>
  );
}

