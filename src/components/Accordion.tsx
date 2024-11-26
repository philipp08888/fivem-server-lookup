"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { motion } from "motion/react";
import { ReactNode, useState } from "react";

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
}

export const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col justify-center">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
      >
        <div className="flex-1 flex items-center">{title}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="size-4" />
        </motion.div>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="p-2">{children}</div>
      </motion.div>
    </div>
  );
};
