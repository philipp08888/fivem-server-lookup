"use client";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react";

interface CopyTextProps {
  text: string;
}

export const CopyText = ({ text }: CopyTextProps) => {
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Error while copying", err);
    }
  }, [text]);

  return (
    <ClipboardIcon
      className="size-4 cursor-pointer select-none"
      onClick={copy}
    />
  );
};
