import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { Footer } from "@/components/layout/Footer";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], style: ["normal", "italic"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Lumina Dental — Your smile, engineered with precision", template: "%s · Lumina Dental" },
  description: "A live digital dental lab: 3D scanning, robotic milling and same-day crowns, designed and fitted in a single visit.",
};

export const viewport: Viewport = { themeColor: "#050d18" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-cyan-glow focus:px-4 focus:py-2 focus:text-navy-950">
          Skip to content
        </a>
        <IntroLoader />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
