import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aryan - Full-stack Developer",
  description:
    "Personal portfolio of Aryan, full-stack developer working with MERN, applied AI, and search systems.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Aryan - Full-stack Developer",
    description: "Quiet, reliable software - web platforms, AI interactions, retrieval at scale.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="grain vignette min-h-screen bg-ink-950 font-sans text-ivory antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ivory focus:px-3 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Background />
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
