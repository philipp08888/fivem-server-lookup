"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import React from "react";

export const SearchBarFooter = (): React.JSX.Element => {
  return (
    <div className="flex flex-row justify-end gap-2 rounded-b-md border-t-2 border-[#555] bg-[#333] p-2">
      <div className="flex flex-row items-center gap-1">
        <span className="select-none rounded-md bg-[#444] p-0.5 text-[#ccc] shadow-md">
          <ChevronUpIcon className="size-4" />
        </span>
        <span className="select-none rounded-md bg-[#444] p-0.5 text-[#ccc] shadow-md">
          <ChevronDownIcon className="size-4" />
        </span>
        navigate
      </div>
      <div className="flex flex-row items-center gap-1">
        <span className="select-none rounded-md bg-[#444] p-0.5 text-[#ccc] shadow-md">
          esc
        </span>
        Close
      </div>
      <div className="flex flex-row items-center gap-1">
        <span className="select-none rounded-md bg-[#444] p-0.5 text-[#ccc] shadow-md">
          ↵
        </span>
        Return
      </div>
    </div>
  );
};
