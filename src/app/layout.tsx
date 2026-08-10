import type { Metadata } from "next";
import "./globals.css";
import "./product.css";
import { StoreHydration } from "@/providers/store-hydration";

export const metadata: Metadata = {
  title: "INCREFF Training",
  description: "Interactive training for INCREFF WMS and OMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
