import { SearchBar } from "@/src/components/SearchBar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "react-tippy/dist/tippy.css";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FiveM Server Lookup",
  description: "Get detailed information about a specific FiveM server",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased p-4`}
      >
        <SearchBar />
        {children}
      </body>
    </html>
  );
}
