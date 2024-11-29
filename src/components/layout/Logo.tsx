"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      className="flex w-full justify-center py-4 max-w-[250px] mx-auto"
      href="/"
    >
      <Image
        src="/logo.svg"
        alt="Logo"
        width={250}
        height={50}
        className="select-none"
        draggable={false}
      />
    </Link>
  );
};
