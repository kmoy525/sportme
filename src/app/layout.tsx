import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

// Heavy geometric display face — headlines and the match moment.
const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SportMe",
  description: "Workouts are better together. Find people to train with, by sport.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={display.variable}>
      <head>
        {/* General Sans isn't on Google Fonts, so it's loaded via Fontshare's CDN. */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
