"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { motion } from "motion/react";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface AccordionProps {
  title: ReactNode;
}

export const Accordion = ({
  title,
  children,
}: PropsWithChildren<AccordionProps>) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div className="flex flex-col justify-center">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
      >
        <div className="flex flex-1 items-center">{title}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDownIcon className="size-4" />
        </motion.div>
      </div>
      <motion.div
        initial={{ maxHeight: 0, opacity: 0 }}
        animate={{
          maxHeight: isOpen ? contentHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div ref={contentRef} className="p-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
