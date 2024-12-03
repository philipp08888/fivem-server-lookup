"use client";

import { ReactNode } from "react";

export const Tag = ({ children }: { children: ReactNode }) => {
  return <div className="select-none text-xs text-[#999]">{children}</div>;
};
