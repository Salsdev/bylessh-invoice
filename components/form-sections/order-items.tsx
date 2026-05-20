"use client";

import { useInvoiceStore } from "@/store/invoice-store";
import { Section, Field, Input, Row } from "@/components/ui/form-components";

export default function OrderItems() {
  const items = useInvoiceStore((state) => state.items);
  const patchItem = useInvoiceStore((state) => state.patchItem);
  const addItem = useInvoiceStore((state) => state.addItem);
  const deleteItem = useInvoiceStore((state) => state.deleteItem);

  const handleItemField = (
    id: string,
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value;
    const value =
      field === "qty" || field === "price"
        ? raw === ""
          ? ""
          : Number(raw)
        : raw;
    patchItem(id, field, value);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n || 0);

  return (
    <Section title="Order Items">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="bg-brand-light border border-line rounded-[7px] p-2.5 mb-2 relative md:p-2.5 p-3"
        >
          <span className="inline-block bg-brand text-brand-light text-[8px] font-bold tracking-[0.1em] uppercase rounded-[3px] px-1.5 py-0.5 mb-2">
            Item {idx + 1}
          </span>
          {items.length > 1 && (
            <button
              onClick={() => deleteItem(item.id)}
              className="absolute top-2 right-2 bg-transparent border-none text-brand cursor-pointer text-[17px] leading-none p-1 hover:text-brand-dark active:scale-90 transition-all
                md:p-0 md:text-[17px] text-xl min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              ×
            </button>
          )}
          <Field label="Cake / Product Name">
            <Input
              placeholder="e.g. Vintage Heart Cake"
              value={item.name}
              onChange={(e) => handleItemField(item.id, "name", e)}
            />
          </Field>
          <Field label="Description / Flavour / Specification">
            <Input
              placeholder="e.g. 3-tier, vanilla sponge, fondant roses"
              value={item.desc}
              onChange={(e) => handleItemField(item.id, "desc", e)}
            />
          </Field>
          <Row>
            <Field label="Qty" half>
              <Input
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => handleItemField(item.id, "qty", e)}
                className="text-center"
              />
            </Field>
            <Field label="Unit Price (₦)" half>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={item.price}
                onChange={(e) => handleItemField(item.id, "price", e)}
              />
            </Field>
          </Row>
          <div className="text-[11px] text-brand font-bold text-right mt-1.5 md:text-[11px] text-xs">
            Subtotal:{" "}
            {fmt((Number(item.qty) || 0) * (Number(item.price) || 0))}
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2.5 border-[1.5px] border-dashed border-brand bg-transparent text-brand
          rounded-md text-[11px] font-bold tracking-[0.06em] uppercase cursor-pointer font-[inherit]
          hover:bg-brand/5 active:bg-brand/10 transition-colors
          md:py-2.5 py-3.5 md:text-[11px] text-xs"
      >
        + Add Another Item
      </button>
    </Section>
  );
}
