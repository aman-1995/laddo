import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laddo Ecomm",
  description: "Production-ready eCommerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
