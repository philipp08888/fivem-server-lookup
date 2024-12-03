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
      className="flex w-full gap-4 flex-row cursor-pointer justify-between hover:bg-[#444] p-2 rounded-md"
      onClick={onClick}
    >
      <div className="flex flex-row gap-2 flex-nowrap">
        <Image
          src={imageSrc}
          alt="Server Icon"
          height={64}
          width={64}
          className="rounded-md w-12 h-12"
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
