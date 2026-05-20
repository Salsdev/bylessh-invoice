"use client";

import { useInvoiceStore } from "@/store/invoice-store";
import { Section, Field, Input } from "@/components/ui/form-components";

export default function DiscountSection() {
  const discount = useInvoiceStore((state) => state.discount);
  const setDiscount = useInvoiceStore((state) => state.setDiscount);

  return (
    <Section title="Discount">
      <Field label="Discount (%)">
        <Input
          type="number"
          min={0}
          max={100}
          placeholder="0"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="!w-1/2"
        />
      </Field>
    </Section>
  );
}
