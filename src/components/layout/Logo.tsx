"use client";

import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      className="mx-auto flex w-full max-w-[250px] justify-center py-4"
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
