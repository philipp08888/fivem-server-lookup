import { Footer } from "@/src/components/layout/Footer";
import { Logo } from "@/src/components/layout/Logo";
import { SearchBar } from "@/src/components/SearchBar";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "react-tippy/dist/tippy.css";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
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
        className={`${poppins.className} antialiased overflow-y-scroll scroll-smooth`}
      >
        <div className="flex flex-col min-h-screen px-4">
          <Logo />
          <SearchBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
