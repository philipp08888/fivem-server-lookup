"use client";

import { ReactNode } from "react";

export const Tag = ({ children }: { children: ReactNode }) => {
  return <div className="select-none text-[#999] text-xs">{children}</div>;
};
