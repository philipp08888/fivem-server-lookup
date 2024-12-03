"use client";

import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

interface NoResultsProps {
  query?: string;
  onClick: () => void;
}

export const NoResults = ({
  query,
  onClick,
}: NoResultsProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-2 justify-center border-[#555] border-t-2 px-4 pb-4 pt-2 min-h-32">
      <div className="flex flex-col gap-1 p-2 bg-[#444] rounded-md">
        <h1 className="text-xl">No results found</h1>
        <p className="text-sm text-[#cccccc87]">
          Note: A server can only be reached by its name via the search when it
          is used on this page for the first time. If the server is not yet
          indexed, you must use the Id for the first time
        </p>
      </div>
      {query && (
        <div
          className="w-full flex justify-between hover:bg-[#444] cursor-pointer rounded-md px-4 py-2"
          onClick={onClick}
        >
          Search with Id: {query}
          <div className="flex items-center">
            <ArrowUpRightIcon className="size-4" />
          </div>
        </div>
      )}
    </div>
  );
};
