import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { SmoothScroll } from "@/components/site/smooth-scroll";

const sans = Manrope({
  variable: "--font-sans-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} – Online healthcare and coordinated care`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: { type: "website", siteName, locale: "en_NG" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" data-theme="light" className={`${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
