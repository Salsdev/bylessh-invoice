import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid, genInvoiceNumber, todayISO, addDays } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface InvoiceItem {
  id: string;
  name: string;
  desc: string;
  qty: number;
  price: number | "";
}

export interface InvoiceState {
  biz: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    acct: string;
  };
  inv: {
    number: string;
    date: string;
    due: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: InvoiceItem[];
  notes: string;
  discount: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const createBlankItem = (): InvoiceItem => ({
  id: uid(),
  name: "",
  desc: "",
  qty: 1,
  price: "",
});

const createInitialState = (): InvoiceState => ({
  biz: {
    name: "bylessh",
    tagline: "EST 2022",
    address: "Abuja, Nigeria",
    phone: "+234 800 000 0000",
    email: "hello@bylessh.com",
    acct: "Zenith Bank · 1234567890 · Bylessh Ltd",
  },
  inv: {
    number: genInvoiceNumber(),
    date: todayISO(),
    due: addDays(7),
  },
  customer: { name: "", phone: "", email: "", address: "" },
  items: [createBlankItem()],
  notes:
    "Payment must be received before collection.\nCustomised orders require a 50% deposit. \nKindly send payment receipt for confirmation.",
  discount: "",
});

// ─── Actions ─────────────────────────────────────────────────────────────────
interface InvoiceActions {
  patchBiz: (field: string, value: string) => void;
  patchInv: (field: string, value: string) => void;
  patchCustomer: (field: string, value: string) => void;
  patchItem: (id: string, field: string, value: string | number) => void;
  addItem: () => void;
  deleteItem: (id: string) => void;
  setNotes: (notes: string) => void;
  setDiscount: (discount: string) => void;
  reset: () => void;
  getTotals: () => { sub: number; discAmt: number; total: number };
}

// ─── Store ───────────────────────────────────────────────────────────────────
export const useInvoiceStore = create<InvoiceState & InvoiceActions>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      patchBiz: (field, value) =>
        set((s) => ({ biz: { ...s.biz, [field]: value } })),

      patchInv: (field, value) =>
        set((s) => ({ inv: { ...s.inv, [field]: value } })),

      patchCustomer: (field, value) =>
        set((s) => ({ customer: { ...s.customer, [field]: value } })),

      patchItem: (id, field, value) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, [field]: value } : i
          ),
        })),

      addItem: () =>
        set((s) => ({ items: [...s.items, createBlankItem()] })),

      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      setNotes: (notes) => set({ notes }),

      setDiscount: (discount) => set({ discount }),

      reset: () => set(createInitialState()),

      getTotals: () => {
        const { items, discount } = get();
        const sub = items.reduce(
          (a, i) => a + (Number(i.qty) || 0) * (Number(i.price) || 0),
          0
        );
        const discPct = parseFloat(discount) || 0;
        const discAmt = (sub * discPct) / 100;
        const total = sub - discAmt;
        return { sub, discAmt, total };
      },
    }),
    { name: "bylessh-invoice" }
  )
);
