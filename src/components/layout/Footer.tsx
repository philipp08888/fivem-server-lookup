"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex h-full items-center justify-center gap-2 py-2">
      &copy; {new Date().getFullYear()}
      <Link href="https://discord.gg/S8Z77aS">raw</Link>
    </footer>
  );
};
