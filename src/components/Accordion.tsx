"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { ReactNode, useState } from "react";

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
}

export const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleAccordion = () => setOpen((prevState) => !prevState);

  return (
    <div className="flex flex-col gap-2 justify-center">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
      >
        {title}
        {isOpen ? (
          <ChevronUpIcon className="size-4" />
        ) : (
          <ChevronDownIcon className="size-4" />
        )}
      </div>
      {isOpen && (
        <div
          id="accordion-content"
          className={`transition-all duration-300 ease-in-out ${
            !isOpen ? "max-h-0" : ""
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
