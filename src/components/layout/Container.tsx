"use client";

import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={`flex max-w-[1000px] w-full flex-col mt-4 rounded-md mx-auto bg-[#333] shadow-bg ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};
