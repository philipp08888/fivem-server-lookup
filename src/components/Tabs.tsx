"use client";

import { ReactNode, useState } from "react";
import { Divider } from "./Divider";

interface TabsProps {
  tabs: { name: string; content: ReactNode }[];
}

export const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-center gap-4">
        {tabs.map((tabs, index) => (
          <span
            key={tabs.name}
            onClick={() => setActiveTab(index)}
            className={`${
              activeTab === index ? "bg-[#444] shadow-bg" : "text-gray-200"
            } cursor-pointer rounded-md px-4 py-2 text-sm hover:shadow-bg`}
          >
            {tabs.name}
          </span>
        ))}
      </div>
      <Divider />
      <div className="flex justify-center">{tabs[activeTab].content}</div>
    </div>
  );
};
