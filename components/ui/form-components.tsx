"use client";

import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] font-extrabold tracking-[0.12em] uppercase text-brand md:text-[9px] text-[10px]">
      {children}
    </span>
  );
}

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-brand-mid/30 rounded-[5px] px-2.5 py-1.5 text-xs
        text-ink bg-surface font-[inherit] outline-none
        focus:border-brand focus:ring-2 focus:ring-brand/15
        transition-shadow
        md:px-2.5 md:py-1.5 md:text-xs
        px-3 py-2.5 text-sm ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  half,
  children,
}: {
  label: string;
  half?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`mb-2 md:mb-2 mb-3 ${half ? "flex-1 min-w-0" : ""}`}>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}

export function Section({
  title,
  last,
  action,
  children,
}: {
  title: string;
  last?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`px-4 py-3.5 md:px-4 md:py-3.5 px-4 py-4 ${last ? "" : "border-b border-line-light"
        }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-[9px] font-extrabold tracking-[0.14em] uppercase text-brand md:text-[9px] text-[10px]">
          {title}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
