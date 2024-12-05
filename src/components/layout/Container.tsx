"use client";

import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={`mx-auto mt-4 flex w-full max-w-[1000px] flex-col rounded-md bg-[#333] shadow-bg ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};
