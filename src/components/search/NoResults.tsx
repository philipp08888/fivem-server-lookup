"use client";

import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import React from "react";
import { TEST_IDS } from "@/src/functions/testIds";

interface NoResultsProps {
  query: string;
  onClick: () => void;
}

export const NoResults = ({
  query,
  onClick,
}: NoResultsProps): React.JSX.Element => {
  return (
    <div className="flex min-h-32 flex-col justify-center gap-2 border-t-2 border-[#555] px-4 pb-4 pt-2">
      <div className="flex flex-col gap-1 rounded-md bg-[#444] p-4">
        <h1 className="text-xl">No results found</h1>
        <p className="text-sm text-[#cccccc87]">
          Note: A server can only be found by its name if it has already been
          searched for on this page. If the server hasn&#39;t been indexed yet,
          you need to use the server&#39;s ID for the first search!
          <br /> <br />
          If you have any further questions, feel free to reach out on{" "}
          <a
            className="font-bold text-primary"
            href="https://discord.gg/S8Z77aS"
          >
            Discord
          </a>
          .
        </p>
      </div>
      <div
        className="flex w-full cursor-pointer justify-between rounded-md px-4 py-2 hover:bg-[#444]"
        onClick={onClick}
        data-testid={TEST_IDS.RESULTS.NO_RESULTS_SEARCH}
      >
        Search with Id: {query}
        <div className="flex items-center">
          <ArrowUpRightIcon className="size-4" />
        </div>
      </div>
    </div>
  );
};
