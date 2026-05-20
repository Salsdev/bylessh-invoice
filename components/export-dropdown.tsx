"use client";

import { useState, useEffect, useRef } from "react";

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

  function handlePDF() {
    close();
    try {
      window.print();
    } catch {
      setStatus("❌ Could not open print dialog. Try Ctrl+P / Cmd+P.");
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
      setStatus("⚠ To save as image: right-click the invoice preview and choose 'Save as Image'.");
      return;
    }

    // Use the Canvas API to capture the element
    try {
      // Create a canvas matching the element's rendered size
      const rect = el.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      const scale = 2; // 2× for retina quality
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // Draw a white background first
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Use foreignObject via SVG to capture the DOM node
      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${rect.width}" height="${rect.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${el.outerHTML}
            </div>
          </foreignObject>
        </svg>`;

      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const img = new window.Image();

      img.onload = () => {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) {
            setStatus("⚠ Could not generate image. Try right-clicking the invoice and saving.");
            return;
          }
          const link = document.createElement("a");
          link.download = "bylessh-invoice.png";
          link.href = URL.createObjectURL(pngBlob);
          link.click();
          setTimeout(() => URL.revokeObjectURL(link.href), 1000);
          setStatus("✅ Image downloaded!");
        }, "image/png");
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setStatus("⚠ To save as image: right-click the invoice and choose 'Save as Image'.");
      };

      img.src = url;
    } catch {
      setStatus("⚠ To save as image: right-click the invoice and choose 'Save as Image'.");
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
    <div ref={wrapperRef} className="relative">
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
