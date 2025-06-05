import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "unangifier",
  description: "uyangnang unarbeneng ujaaneng ucaynong",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
