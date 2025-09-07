"use client";

import React, { FC } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";

type PlayButtonProps = {
  endpointUrl: string;
};

export const PlayButton: FC<PlayButtonProps> = ({
  endpointUrl,
}): React.JSX.Element => {
  return (
    <a href={`fivem://${endpointUrl}`} title="Connect to server">
      <PlayIcon className="size-5 text-primary [&>path]:stroke-[2]" />
    </a>
  );
};
