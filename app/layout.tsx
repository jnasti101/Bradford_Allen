import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthGate } from "@/components/auth-gate";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bradford Allen | Portfolio Analytics",
  description: "Real estate portfolio analytics demo for Bradford Allen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
