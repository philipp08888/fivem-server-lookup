import { SearchBar } from "@/src/components/SearchBar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
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
        <div className="flex w-full justify-center py-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={250}
            height={50}
            className="select-none"
            draggable={false}
          />
        </div>
        <SearchBar />
        {children}
      </body>
    </html>
  );
}
