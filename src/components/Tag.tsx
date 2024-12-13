"use client";

import { PropsWithChildren } from "react";

export const Tag = ({ children }: PropsWithChildren) => {
  return <div className="select-none text-xs text-[#999]">{children}</div>;
};
