import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeCome Live — Operations console",
  description:
    "Admin, payer ops, support and audit tooling for LifeCome Live staff.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
