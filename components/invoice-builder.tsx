"use client";

import { useState, useEffect, useRef } from "react";
import InvoiceForm from "./invoice-form";
import InvoicePreview from "./invoice-preview";
import { HiOutlinePencilSquare, HiOutlineEye } from "react-icons/hi2";

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
            <HiOutlinePencilSquare className="w-5 h-5" />
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
            <HiOutlineEye className="w-5 h-5" />
            Preview
          </button>
        </nav>
      </div>
    </>
  );
}
