"use client";

import { ReactNode } from "react";
import { isDefined } from "../functions/isDefined";
import { InformativeTooltip } from "./InformativeTooltip";

interface ColumnProps {
  name: string;
  value: string | number;
  tooltip?: ReactNode;
}

export const Column = ({
  name,
  value,
  tooltip,
}: ColumnProps): React.JSX.Element => {
  return (
    <div className="flex flex-col">
      <div className="select-none text-[#999] text-xs">{name}</div>
      <div className="flex flex-row gap-1">
        {value}
        {isDefined(tooltip) && (
          <InformativeTooltip>{tooltip}</InformativeTooltip>
        )}
      </div>
    </div>
  );
};
