"use client";

import { ReactNode } from "react";

export const Tag = ({ children }: { children: ReactNode }) => {
  return (
    <p className="text-xs text-[#999] uppercase select-none">{children}</p>
  );
};
