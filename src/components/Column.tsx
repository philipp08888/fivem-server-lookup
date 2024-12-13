"use client";

import { ReactNode } from "react";
import { isDefined } from "../functions/isDefined";
import { InformativeTooltip } from "./InformativeTooltip";
import { Tag } from "./Tag";

interface ColumnProps {
  name: string;
  value: string | number;
  tooltipText?: ReactNode;
}

export const Column = ({
  name,
  value,
  tooltipText,
}: ColumnProps): React.JSX.Element => {
  return (
    <div className="flex flex-col">
      <Tag>{name}</Tag>
      <div className="flex flex-row gap-1">
        {value}
        {isDefined(tooltipText) && (
          <InformativeTooltip>{tooltipText}</InformativeTooltip>
        )}
      </div>
    </div>
  );
};
