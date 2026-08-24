import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ONEGOV — Government Services, Connected Around You | Digital India",
  description:
    "ONEGOV is India's unified government-service orchestration platform. One Request. Multiple Services. One Unified Journey. Digital India Initiative.",
  keywords: ["Digital India", "Government Services", "ONEGOV", "Aadhaar", "PAN", "Passport", "Driving License", "Voter ID"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 font-sans antialiased">
        <LanguageProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
