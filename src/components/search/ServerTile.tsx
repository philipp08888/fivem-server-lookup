"use client";

import { ArrowUpRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { formatToHTMLColor } from "../../functions/formatToHTMLColor";

interface ServerTileProps {
  imageSrc: string;
  hostname: string;
  onClick: () => void;
}

export const ServerTile = ({
  imageSrc,
  hostname,
  onClick,
}: ServerTileProps): React.JSX.Element => {
  return (
    <div
      className="flex w-full cursor-pointer flex-row justify-between gap-4 rounded-md p-2 hover:bg-[#444]"
      onClick={onClick}
    >
      <div className="flex flex-row flex-nowrap gap-2">
        <Image
          src={imageSrc}
          alt="Server Icon"
          height={64}
          width={64}
          className="h-12 w-12 rounded-md"
        />
        <p className="line-clamp-2 overflow-hidden text-ellipsis">
          {formatToHTMLColor(hostname)}
        </p>
      </div>
      <div className="flex items-center">
        <ArrowUpRightIcon className="size-4" />
      </div>
    </div>
  );
};
