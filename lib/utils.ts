// ─── Currency ────────────────────────────────────────────────────────────────
export const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n || 0);

// ─── Dates ───────────────────────────────────────────────────────────────────
export const todayISO = () => new Date().toISOString().split("T")[0];

export const addDays = (days: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().split("T")[0];
};

export const prettyDate = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d} ${months[+m - 1]}, ${y}`;
};

// ─── IDs ─────────────────────────────────────────────────────────────────────
export const genInvoiceNumber = () => {
  const d = new Date();
  return `BYL-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    Math.floor(Math.random() * 900) + 100
  )}`;
};

export const uid = () => Math.random().toString(36).slice(2);
