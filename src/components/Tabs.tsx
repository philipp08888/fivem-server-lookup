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
      <div className="flex flex-row gap-4 justify-center">
        {tabs.map((tabs, index) => (
          <span
            key={tabs.name}
            onClick={() => setActiveTab(index)}
            className={`${
              activeTab === index ? " shadow-bg bg-[#444]" : "text-gray-200"
            } hover:shadow-bg rounded-md px-4 py-2 cursor-pointer text-sm`}
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
