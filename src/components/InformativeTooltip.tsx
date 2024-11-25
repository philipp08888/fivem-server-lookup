import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";

export const InformativeTooltip = ({
  children,
  position = "right",
}: {
  children: ReactNode;
  position?: "right" | "left" | "top" | "bottom";
}): React.JSX.Element => {
  return (
    <Tooltip content={children} position={position}>
      <InformationCircleIcon className="size-6 text-[#cccccc98]" />
    </Tooltip>
  );
};
