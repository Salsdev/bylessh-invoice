"use client";

import { useState, useEffect, useRef } from "react";
import InvoiceForm from "./invoice-form";
import InvoicePreview from "./invoice-preview";

export default function InvoiceBuilder() {
  // Zustand's persist middleware reads localStorage on mount.
  // Delay render until client-side to avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex h-dvh bg-surface-warm items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-brand/30 border-t-brand rounded-full animate-spin" />
          <span className="text-xs font-semibold text-brand tracking-wider uppercase">
            Loading invoice…
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop: side-by-side ── */}
      <div className="hidden md:flex h-dvh font-sans bg-surface-warm print:flex print:h-auto">
        <InvoiceForm />
        <InvoicePreview paperRef={paperRef} />
      </div>

      {/* ── Mobile: tabbed layout ── */}
      <div className="flex flex-col h-dvh font-sans bg-surface-warm md:hidden print:hidden">
        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "form" ? (
            <InvoiceForm isMobile />
          ) : (
            <InvoicePreview isMobile paperRef={paperRef} />
          )}
        </div>

        {/* Bottom tab bar */}
        <nav className="flex border-t border-line bg-surface shrink-0 safe-bottom">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold tracking-wider uppercase border-none cursor-pointer transition-colors ${
              activeTab === "form"
                ? "text-brand bg-brand-light"
                : "text-ink-muted bg-transparent"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold tracking-wider uppercase border-none cursor-pointer transition-colors ${
              activeTab === "preview"
                ? "text-brand bg-brand-light"
                : "text-ink-muted bg-transparent"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
              <path
                fillRule="evenodd"
                d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Preview
          </button>
        </nav>
      </div>
    </>
  );
}
