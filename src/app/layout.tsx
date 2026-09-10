import type { Metadata, Viewport } from "next";
import { Kalam, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

// Hand-lettered display face for headings — the "pencil" of the sketchbook theme.
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NestWise — a family learning companion",
    template: "%s · NestWise",
  },
  description:
    "Every parent learns, every day. NestWise guides families through pregnancy, childbirth, and early parenting with personalized learning — calm, evidence-informed, and never clinical. Not a medical or emergency service.",
};

export const viewport: Viewport = {
  themeColor: "#f7f1e4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${kalam.variable}`}>
      <body>{children}</body>
    </html>
  );
}
