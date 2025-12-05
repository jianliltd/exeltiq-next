import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { I18nProvider } from "@/components/i18n-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProviderWrapper } from "../components/clerk-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExeltIQ CRM - Analytics-Driven Business Management",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <I18nProvider>  
          <ClerkProviderWrapper
          >
            {children}
          </ClerkProviderWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}