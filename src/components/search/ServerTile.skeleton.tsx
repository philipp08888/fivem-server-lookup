"use client";

export const ServerTileSkeleton = (): React.JSX.Element => {
  return (
    <div className="flex flex-row h-16 rounded-md justify-between w-full gap-4 p-2 animate-pulse">
      <div className="flex flex-row gap-2 w-full">
        <div className="max-w-12 w-full h-full  bg-[#444] rounded-md"></div>
        <div className="space-y-2 w-full">
          <div className="h-4 bg-[#444] rounded"></div>
          <div className="h-4 bg-[#444] rounded w-4/6"></div>
        </div>
      </div>
      <div className="h-4 w-4 bg-[#444] rounded"></div>
    </div>
  );
};
