"use client";

import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex justify-center h-full items-center py-2 gap-2">
      &copy; {new Date().getFullYear()}
      <Link href="https://discord.gg/S8Z77aS">raw</Link>
    </footer>
  );
};
