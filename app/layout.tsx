import { Footer } from "@/src/components/layout/Footer";
import { Logo } from "@/src/components/layout/Logo";
import { SearchBar } from "@/src/components/search/SearchBar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
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
        className={`${poppins.className} overflow-y-scroll scroll-smooth antialiased`}
      >
        <div className="flex min-h-screen flex-col px-4">
          <Logo />
          <SearchBar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
