import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.scss";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Victoria Falls Discovery Tours",
    template: "%s | Victoria Falls Discovery Tours",
  },
  icons: {
    icon: "/brand/discovery.png",
    shortcut: "/brand/discovery.png",
    apple: "/brand/discovery.png",
  },
  description:
    "Tailored transfers, accommodation, and activities crafted for seamless Victoria Falls travel experiences.",
  keywords: [
    "Victoria Falls tours",
    "Transfers",
    "Accommodation",
    "Activities",
    "Tourism",
    "Hospitality",
  ],
  openGraph: {
    title: "Victoria Falls Discovery Tours",
    description:
      "Discover a refined tourism and hospitality site for transfers, accommodation, and curated experiences.",
    siteName: "Victoria Falls Discovery Tours",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Victoria Falls Discovery Tours",
    description:
      "Transfers, accommodation, and activities designed for smooth, memorable Victoria Falls travel.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a className="skipLink" href="#content">
          Skip to content
        </a>
        <div className="siteShell">
          <SiteHeader />
          <main id="content" className="siteMain">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
