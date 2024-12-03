"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export const Error = ({ message }: { message: string }) => {
  return (
    <div className="mx-auto mt-4 flex max-w-[512px] flex-row items-center gap-2 rounded-md bg-red-500 px-4 py-2">
      <ExclamationTriangleIcon className="size-4" />
      <p>{message}</p>
    </div>
  );
};
