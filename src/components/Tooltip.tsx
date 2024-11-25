"use client";

import { ReactNode, useRef, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "left" | "right" | "top" | "bottom";
  delay?: number;
}

export const Tooltip = ({
  children,
  content,
  position = "right",
  delay = 200,
}: TooltipProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tooltipPositions = {
    left: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    top: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    bottom: "right-full top-1/2 transform -translate-y-1/2 mr-2",
  };

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), delay);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute whitespace-nowrap bg-[#222] text-white text-sm py-1 px-2 rounded shadow-lg left-full top-1/2 transform -translate-y-1/2 ml-2 ${tooltipPositions[position]}`}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {content}
        </div>
      )}
    </div>
  );
};
