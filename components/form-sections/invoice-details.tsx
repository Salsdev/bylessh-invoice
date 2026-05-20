"use client";

import { useInvoiceStore } from "@/store/invoice-store";
import { Section, Field, Input, Row } from "@/components/ui/form-components";

export default function InvoiceDetails() {
  const inv = useInvoiceStore((state) => state.inv);
  const patchInv = useInvoiceStore((state) => state.patchInv);

  return (
    <Section title="Invoice Details">
      <Field label="Invoice Number">
        <Input
          value={inv.number}
          onChange={(e) => patchInv("number", e.target.value)}
        />
      </Field>
      <Row>
        <Field label="Issue Date" half>
          <Input
            type="date"
            value={inv.date}
            onChange={(e) => patchInv("date", e.target.value)}
          />
        </Field>
        <Field label="Due Date" half>
          <Input
            type="date"
            value={inv.due}
            onChange={(e) => patchInv("due", e.target.value)}
          />
        </Field>
      </Row>
    </Section>
  );
}
