"use client";

import { useInvoiceStore } from "@/store/invoice-store";
import { fmt, prettyDate } from "@/lib/utils";
import { LOGO_SRC } from "@/lib/logo";
import { useRef } from "react";
import ExportDropdown from "@/components/export-dropdown";

export default function InvoicePreview({ isMobile }: { isMobile?: boolean }) {
  const biz = useInvoiceStore((state) => state.biz);
  const inv = useInvoiceStore((state) => state.inv);
  const customer = useInvoiceStore((state) => state.customer);
  const items = useInvoiceStore((state) => state.items);
  const notes = useInvoiceStore((state) => state.notes);
  const discount = useInvoiceStore((state) => state.discount);
  const getTotals = useInvoiceStore((state) => state.getTotals);
  const paperRef = useRef<HTMLDivElement>(null);

  const { sub, discAmt, total } = getTotals();
  const discPct = parseFloat(discount) || 0;
  const filled = items.filter((i) => i.name || i.price);

  return (
    <main
      className={`flex-1 overflow-y-auto flex flex-col items-center gap-3
        print:p-0 print:bg-white print:h-auto print:overflow-visible ${isMobile ? "p-3 pb-4" : "p-5"
        }`}
    >
      {/* Label */}
      <div
        className={`text-[9px] font-bold tracking-[0.14em] uppercase text-ink-faint self-start print:hidden ${isMobile ? "text-[10px]" : ""
          }`}
      >
        {isMobile
          ? "Preview — Scroll down to download"
          : 'Live Preview — "Download PDF" to print'}
      </div>

      {/* ══ Paper ══ */}
      <div
        ref={paperRef}
        className={`bg-white w-full
          shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-line-light/50
          print:shadow-none print:max-w-none print:w-full ${isMobile
            ? "max-w-full rounded-lg overflow-hidden"
            : "max-w-[540px]"
          }`}
      >
        {/* ── Letterhead ── */}
        <div
          className={`bg-white flex justify-between items-center border-b border-line-light ${isMobile
            ? "px-4 pt-4 pb-3 flex-col gap-2 sm:flex-row"
            : "px-7 pt-[22px] pb-3.5"
            }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            alt="bylessh logo"
            className={`object-contain block print:h-32 print:w-auto ${isMobile ? "h-24 w-auto" : "h-32 w-auto"
              }`}
          />
          <div
            className={`text-brand leading-[1.9] shrink-0 ${isMobile
              ? "text-[9px] text-center sm:text-right max-w-full"
              : "text-[9.5px] text-right max-w-[155px]"
              }`}
          >
            {biz.phone && <div>{biz.phone}</div>}
            {biz.email && <div>{biz.email}</div>}
            {biz.address && <div>{biz.address}</div>}
          </div>
        </div>

        {/* ── Brand Stripe ── */}
        <div
          className={`bg-brand-dark flex justify-between items-center ${isMobile
            ? "px-4 py-2 flex-col gap-1 sm:flex-row sm:gap-0"
            : "px-7 py-2.5"
            }`}
        >
          <div
            className={`font-extrabold text-white tracking-[0.28em] uppercase ${isMobile ? "text-xs" : "text-sm"
              }`}
          >
            Invoice
          </div>
          <div
            className={`text-white/90 leading-[1.9] ${isMobile
              ? "text-[9px] text-center sm:text-right"
              : "text-[9.5px] text-right"
              }`}
          >
            <strong>{inv.number}</strong>
            <br />
            Issued: {prettyDate(inv.date)}
            <br />
            Due: {prettyDate(inv.due)}
          </div>
        </div>

        {/* ── Body ── */}
        <div className={isMobile ? "px-4 py-4" : "px-7 py-[22px]"}>
          {/* Bill To */}
          <div>
            <div className="text-[8.5px] font-extrabold tracking-[0.14em] uppercase text-brand mb-1.5">
              Bill To
            </div>
            {customer.name ? (
              <>
                <div
                  className={`font-bold text-ink ${isMobile ? "text-xs" : "text-[13px]"
                    }`}
                >
                  {customer.name}
                </div>
                <div
                  className={`text-ink-muted leading-[1.85] mt-0.5 ${isMobile ? "text-[10px]" : "text-[10.5px]"
                    }`}
                >
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
          {isMobile ? (
            /* ── Mobile: card-based items ── */
            <div className="space-y-2.5">
              <div className="text-[8.5px] font-extrabold tracking-[0.1em] uppercase text-brand mb-2">
                Items
              </div>
              {filled.length === 0 ? (
                <div className="text-[11px] text-ink-placeholder italic text-center py-5">
                  Add items to see them here…
                </div>
              ) : (
                filled.map((item) => (
                  <div
                    key={item.id}
                    className="border border-line-light rounded-md p-3"
                  >
                    <div className="text-xs font-bold text-ink">
                      {item.name || "—"}
                    </div>
                    {item.desc && (
                      <div className="text-[9.5px] text-ink-faint mt-0.5 leading-[1.5]">
                        {item.desc}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-line-faint">
                      <div className="flex gap-3 text-[10px] text-ink-muted">
                        <span>Qty: {item.qty}</span>
                        <span>@ {fmt(Number(item.price) || 0)}</span>
                      </div>
                      <div className="text-xs font-bold text-ink">
                        {fmt(
                          (Number(item.qty) || 0) * (Number(item.price) || 0)
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* ── Desktop: standard table ── */
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
          )}

          {/* ── Totals ── */}
          <div className={`flex mt-[18px] ${isMobile ? "justify-end" : "justify-end"}`}>
            <div className={isMobile ? "w-full" : "w-[200px]"}>
              <div
                className={`flex justify-between text-ink-muted py-1 ${isMobile ? "text-xs" : "text-[11.5px]"
                  }`}
              >
                <span>Subtotal</span>
                <span>{fmt(sub)}</span>
              </div>
              {discPct > 0 && (
                <div
                  className={`flex justify-between text-[#c05828] py-1 ${isMobile ? "text-xs" : "text-[11.5px]"
                    }`}
                >
                  <span>Discount ({discPct}%)</span>
                  <span>− {fmt(discAmt)}</span>
                </div>
              )}
              <div
                className={`flex justify-between items-center font-extrabold text-brand border-t border-brand/20 pt-4 mt-2 ${isMobile ? "text-lg" : "text-xl"
                  }`}
              >
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
                <div
                  className={`text-ink-faint leading-[1.85] whitespace-pre-line ${isMobile ? "text-[10px]" : "text-[9.5px]"
                    }`}
                >
                  {notes}
                </div>
              )}
              {biz.acct && (
                <div
                  className={`bg-surface-warm border-l-[3px] border-brand/30 py-2.5 px-3 rounded-r text-ink font-semibold mt-2.5 ${isMobile ? "text-[10px]" : "text-[10px]"
                    }`}
                >
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

      {/* Mobile: Export dropdown at bottom of preview */}
      {isMobile && (
        <ExportDropdown paperRef={paperRef} variant="full" />
      )}
    </main>
  );
}
