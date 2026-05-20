import type { Metadata, Viewport } from "next";
import { Inter, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const greatVibes = Great_Vibes({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-great-vibes"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "bylessh — Invoice Builder",
  description:
    "Create and export beautiful bakery invoices. Powered by bylessh.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "bylessh Invoice",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={greatVibes.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
