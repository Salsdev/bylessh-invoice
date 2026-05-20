"use client";

import { useState } from "react";
import { useInvoiceStore } from "@/store/invoice-store";
import { Section, Field, Input, Row } from "@/components/ui/form-components";

export default function BusinessDetails() {
  const [isEditingBiz, setIsEditingBiz] = useState(false);
  
  const biz = useInvoiceStore((state) => state.biz);
  const patchBiz = useInvoiceStore((state) => state.patchBiz);

  return (
    <Section
      title="Business Details"
      last
      action={
        <button
          onClick={() => setIsEditingBiz(!isEditingBiz)}
          className="text-[9px] text-brand font-bold uppercase tracking-wider bg-brand-mid/10 px-2 py-1 rounded hover:bg-brand-mid/20 transition-colors cursor-pointer"
        >
          {isEditingBiz ? "Done" : "Edit"}
        </button>
      }
    >
      {isEditingBiz ? (
        <>
          <Field label="Display Name">
            <Input
              value={biz.name}
              onChange={(e) => patchBiz("name", e.target.value)}
            />
          </Field>
          <Field label="Tagline">
            <Input
              value={biz.tagline}
              onChange={(e) => patchBiz("tagline", e.target.value)}
            />
          </Field>
          <Field label="Address">
            <Input
              value={biz.address}
              onChange={(e) => patchBiz("address", e.target.value)}
            />
          </Field>
          <Row>
            <Field label="Phone" half>
              <Input
                type="tel"
                value={biz.phone}
                onChange={(e) =>
                  patchBiz("phone", e.target.value.replace(/[^0-9+\s()-]/g, ""))
                }
              />
            </Field>
            <Field label="Email" half>
              <Input
                value={biz.email}
                onChange={(e) => patchBiz("email", e.target.value)}
              />
            </Field>
          </Row>
          <Field label="Bank Account">
            <Input
              value={biz.acct}
              onChange={(e) => patchBiz("acct", e.target.value)}
            />
          </Field>
        </>
      ) : (
        <div className="text-xs text-ink-muted leading-relaxed">
          <div className="font-bold text-ink">{biz.name}</div>
          {biz.tagline && <div>{biz.tagline}</div>}
          {biz.address && <div>{biz.address}</div>}
          {biz.phone && <div>{biz.phone}</div>}
          {biz.email && <div>{biz.email}</div>}
          {biz.acct && <div className="mt-2 text-[10px] text-ink-faint font-semibold bg-surface-warm p-1.5 rounded">Acct: {biz.acct}</div>}
        </div>
      )}
    </Section>
  );
}
