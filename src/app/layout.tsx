import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVENORA — Find a place that feels like you | Private Real Estate Discovery",
  description:
    "AVENORA is a luxury international real estate discovery platform curating architectural sanctuaries, rare coastlines, and private residences worldwide.",
  keywords: [
    "luxury real estate",
    "architectural estates",
    "private residences",
    "Avenora",
    "modern luxury villas",
  ],
  authors: [{ name: "Studio AVENORA" }],
  openGraph: {
    title: "AVENORA — Find a place that feels like you",
    description: "Curated architectural sanctuaries and private estates worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "AVENORA",
  },
};

export const viewport: Viewport = {
  themeColor: "#263C50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${cormorant.variable} ${plusJakarta.variable} antialiased bg-[#263C50] text-[#FFF9F4] selection:bg-[#F6B99D] selection:text-[#263C50] min-h-screen relative`}
      >
        {children}
      </body>
    </html>
  );
}
