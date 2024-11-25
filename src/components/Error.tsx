"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export const Error = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-row gap-2 items-center max-w-[512px] mx-auto bg-red-500 rounded-md mt-4 px-4 py-2">
      <ExclamationTriangleIcon className="size-4 " />
      <p>{message}</p>
    </div>
  );
};
