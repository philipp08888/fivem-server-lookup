"use client";

import { TEST_IDS } from "@/src/functions/testIds";

export const ServerTileSkeleton = (): React.JSX.Element => {
  return (
    <div
      data-testid={TEST_IDS.RESULTS.SERVER_TILE_LOADING}
      className="flex h-16 w-full animate-pulse flex-row justify-between gap-4 rounded-md p-2"
    >
      <div className="flex w-full flex-row gap-2">
        <div className="h-full w-full max-w-12 rounded-md bg-[#444]"></div>
        <div className="w-full space-y-2">
          <div className="h-4 rounded bg-[#444]"></div>
          <div className="h-4 w-4/6 rounded bg-[#444]"></div>
        </div>
      </div>
      <div className="h-4 w-4 rounded bg-[#444]"></div>
    </div>
  );
};
