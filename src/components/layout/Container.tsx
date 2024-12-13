"use client";

import classNames from "classnames";
import { PropsWithChildren } from "react";

interface ContainerProps {
  className?: string;
}

export const Container = ({
  children,
  className,
}: PropsWithChildren<ContainerProps>) => {
  return (
    <div
      className={classNames(
        "mx-auto mt-4 flex w-full max-w-[1000px] flex-col rounded-md bg-background shadow-bg",
        className,
      )}
      role="region"
    >
      {children}
    </div>
  );
};
