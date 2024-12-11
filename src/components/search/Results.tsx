"use client";

import { SearchMode } from "@/src/components/search/SearchBar";
import { Server } from "@prisma/client";
import _ from "lodash";
import { AnimatePresence, motion, Variants } from "motion/react";
import React, { memo, useEffect, useState } from "react";
import { Tag } from "../Tag";
import { ServerTile } from "./ServerTile";

interface ResultsProps {
  results: Server[];
  onClick: (id: string) => void;
  mode: SearchMode;
}

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const Results = memo(
  ({ results, onClick, mode }: ResultsProps): React.JSX.Element | null => {
    const [renderResults, setRenderResults] = useState<Server[]>(results);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    useEffect(() => {
      if (!_.isEqual(renderResults, results)) {
        setRenderResults(results);
      }
    }, [renderResults, results]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (event.key === "ArrowDown") {
          setSelectedIndex((prevIndex) =>
            Math.min(prevIndex + 1, renderResults.length - 1),
          );
        } else if (event.key === "Enter") {
          onClick(renderResults[selectedIndex].id);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [selectedIndex, renderResults, onClick]);

    if (renderResults.length === 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 border-t-2 border-[#555] px-4 pb-4 pt-2"
      >
        {mode === "RECENTLY_SEARCHED" && <Tag>Recently searched servers</Tag>}
        {mode === "RESULTS" && <Tag>Search Results</Tag>}

        <AnimatePresence>
          <motion.div
            className="flex flex-col gap-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {renderResults.map((result, index) => (
              <motion.div
                key={result.id}
                variants={itemVariants}
                layout
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <ServerTile
                  onClick={() => onClick(result.id)}
                  hostname={result.hostname}
                  imageSrc={`/api/image-proxy?url=${encodeURIComponent(
                    result.image,
                  )}`}
                  isFocused={selectedIndex === index}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  },
);

Results.displayName = "Results";
