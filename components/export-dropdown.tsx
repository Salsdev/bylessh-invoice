"use client";

import { useState, useEffect, useRef } from "react";
import { toPng, toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";

interface ExportDropdownProps {
  /** Optional ref to the invoice paper element for image capture */
  paperRef?: React.RefObject<HTMLElement | null>;
  /** Visual variant — compact for the header, full-width for mobile */
  variant?: "compact" | "full";
}

export default function ExportDropdown({
  paperRef,
  variant = "compact",
}: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear status after a few seconds
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 3500);
    return () => clearTimeout(t);
  }, [status]);

  function close() {
    setOpen(false);
  }

  async function handlePDF() {
    close();
    const el = paperRef?.current;
    if (!el) {
      setStatus("❌ Invoice element not found. Make sure the preview is visible.");
      return;
    }

    setStatus("⚡ Generating production-grade PDF...");

    try {
      const rect = el.getBoundingClientRect();
      const widthPx = rect.width;
      const heightPx = rect.height;

      // 1. Generate optimized, high-resolution JPEG data URL using html-to-image
      // 2x Retina clarity at 92% quality is print-perfect but 95% smaller than lossless PNG!
      const dataUrl = await toJpeg(el, {
        quality: 0.92,
        pixelRatio: 2, // 2x is highly crisp (equivalent to ~300 DPI on standard A4 print)
        backgroundColor: "#ffffff",
        style: {
          margin: "0",
          boxShadow: "none",
          border: "none",
        },
      });

      // 2. Initialize jsPDF (A4 portrait size: 210mm x 297mm)
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10; // 10mm margins
      const printableWidth = pdfWidth - margin * 2;
      const printableHeight = pdfHeight - margin * 2;

      // Calculate A4 printable height based on element aspect ratio
      let imgWidth = printableWidth;
      let imgHeight = (heightPx * printableWidth) / widthPx;

      // Smart Single Page Scaling:
      // If the invoice is relatively short (up to 340mm), we scale it down slightly
      // so it fits completely on a single page, avoiding an accidental second page.
      const maxSinglePageLimit = 340;
      let xOffset = margin;
      if (imgHeight <= maxSinglePageLimit) {
        if (imgHeight > printableHeight) {
          const scaleFit = printableHeight / imgHeight;
          imgHeight = printableHeight;
          imgWidth = imgWidth * scaleFit;
          xOffset = margin + (printableWidth - imgWidth) / 2; // Center horizontally
        }
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 3. Draw the invoice into the PDF document with FAST Flate compression enabled
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(dataUrl, "JPEG", xOffset, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= printableHeight;

      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft) + margin;
        pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", xOffset, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= printableHeight;
      }

      // 4. Add elegant, professional page numbering (Page X of Y)
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(138, 90, 72); // Muted brand terracotta (#8a5a48)
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pdfWidth - margin - 20, // right alignment
          pdfHeight - 6 // 6mm offset from bottom
        );
      }

      // 5. Save and trigger direct download
      pdf.save(`bylessh-invoice-${Date.now()}.pdf`);
      setStatus("✅ PDF downloaded!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      setStatus("❌ PDF generation failed.");
    }
  }

  function handlePrint() {
    close();
    try {
      window.print();
    } catch {
      setStatus("❌ Could not open print dialog. Try Ctrl+P / Cmd+P.");
    }
  }

  async function handleImage() {
    close();
    const el = paperRef?.current;
    if (!el) {
      setStatus("❌ Invoice element not found. Make sure the preview is visible.");
      return;
    }

    setStatus("⚡ Generating image...");

    try {
      // Use html-to-image to generate an ultra-sharp, perfectly styled PNG
      const dataUrl = await toPng(el, {
        quality: 1.0,
        pixelRatio: 3, // 3x scale for ultra-sharp high-resolution clarity
        backgroundColor: "#ffffff",
        style: {
          margin: "0",
          boxShadow: "none",
          border: "none",
        },
      });

      const link = document.createElement("a");
      link.download = `bylessh-invoice-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setStatus("✅ Image downloaded! (Ultra-Sharp)");
    } catch (err) {
      console.error("html-to-image failed:", err);
      setStatus("❌ Image export failed.");
    }
  }

  const items = [
    { label: "Download PDF", icon: "📄", action: handlePDF },
    { label: "Download Image", icon: "🖼", action: handleImage },
    { label: "Print Invoice", icon: "🖨", action: handlePrint },
  ];

  const triggerClass =
    variant === "full"
      ? "w-full py-3.5 bg-brand-dark text-white border-none rounded-lg text-xs font-bold tracking-[0.1em] uppercase cursor-pointer flex items-center justify-center gap-2"
      : "bg-brand text-white border-none px-3.5 py-1.5 rounded text-[10px] font-bold tracking-[0.06em] uppercase cursor-pointer flex items-center gap-1.5";

  return (
    <div ref={wrapperRef} className="relative print:hidden">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={triggerClass}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {variant === "full" ? "⬇ Export Invoice" : "Export"}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={`absolute z-50 bg-white border border-line-light shadow-[0_8px_24px_rgba(0,0,0,0.08)]
            rounded-lg overflow-hidden min-w-[176px]
            ${variant === "full" ? "left-0 right-0 bottom-full mb-2" : "right-0 top-full mt-1.5"}`}
          role="listbox"
        >
          {items.map(({ label, icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-left
                text-xs font-medium text-ink hover:bg-brand-light/60
                border-b border-line-light/50 last:border-b-0 cursor-pointer"
              role="option"
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Status / fallback toast */}
      {status && (
        <div
          className={`absolute z-50 bg-ink text-white text-[10px] font-medium px-3 py-2 rounded-lg shadow-lg
            leading-snug max-w-[240px]
            ${variant === "full" ? "bottom-full mb-14 left-0 right-0" : "top-full mt-1.5 right-0"}`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
