import type { Metadata, Viewport } from "next";
import { Anton, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Bold condensed athletic display face — headlines and the match moment.
const display = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Clean humanist sans — body and UI.
const body = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Monospace — stat readouts (belt, weight, height).
const stat = IBM_Plex_Mono({
  variable: "--font-stat",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrainWithMe",
  description: "Find local training partners and weekly events for your sport.",
};

export const viewport: Viewport = {
  themeColor: "#1b3b2f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${stat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
