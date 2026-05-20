"use client";

import { useInvoiceStore } from "@/store/invoice-store";
import { Section, Field, Input, Row } from "@/components/ui/form-components";

export default function CustomerDetails() {
  const customer = useInvoiceStore((state) => state.customer);
  const patchCustomer = useInvoiceStore((state) => state.patchCustomer);

  return (
    <Section title="Bill To — Customer">
      <Field label="Name / Company">
        <Input
          placeholder="Mrs. Adaeze Okonkwo"
          value={customer.name}
          onChange={(e) => patchCustomer("name", e.target.value)}
        />
      </Field>
      <Row>
        <Field label="Phone" half>
          <Input
            type="tel"
            placeholder="+234 812 000 0000"
            value={customer.phone}
            onChange={(e) =>
              patchCustomer("phone", e.target.value.replace(/[^0-9+\s()-]/g, ""))
            }
          />
        </Field>
        <Field label="Email" half>
          <Input
            placeholder="customer@email.com"
            value={customer.email}
            onChange={(e) => patchCustomer("email", e.target.value)}
          />
        </Field>
      </Row>
      <Field label="Address (optional)">
        <Input
          placeholder="Delivery / collection address"
          value={customer.address}
          onChange={(e) => patchCustomer("address", e.target.value)}
        />
      </Field>
    </Section>
  );
}
