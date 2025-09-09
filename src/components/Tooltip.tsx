"use client";

import classNames from "classnames";
import { PropsWithChildren, ReactNode, useRef, useState } from "react";

type TooltipPosition = "left" | "right" | "top" | "bottom";

interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  delay?: number;
}

const DEFAULT_DELAY = 200;
const DEFAULT_POSITION: TooltipPosition = "right";

const TOOLTIP_STYLES = {
  container: "relative inline-block",
  tooltip:
    "absolute w-max max-w-xs rounded bg-[#222] p-2 text-sm text-white shadow-lg whitespace-pre-line",
} as const;

const TOOLTIP_POSITIONS: Record<TooltipPosition, string> = {
  left: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
  right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  top: "top-full left-1/2 transform -translate-x-1/2 mt-2",
  bottom: "right-full top-1/2 transform -translate-y-1/2 mr-2",
} as const;

export const Tooltip = ({
  children,
  content,
  position = DEFAULT_POSITION,
  delay = DEFAULT_DELAY,
}: PropsWithChildren<TooltipProps>): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const showTooltip = () => {
    clearExistingTimeout();
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearExistingTimeout();
    timeoutRef.current = setTimeout(() => setIsVisible(false), delay);
  };

  return (
    <div
      className={TOOLTIP_STYLES.container}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={classNames(
            TOOLTIP_STYLES.tooltip,
            TOOLTIP_POSITIONS[position],
          )}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {content}
        </div>
      )}
    </div>
  );
};
