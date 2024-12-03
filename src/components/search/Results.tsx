"use client";

import { Server } from "@prisma/client";
import _ from "lodash";
import { motion, Variants } from "motion/react";
import { memo, useEffect, useState } from "react";
import { Tag } from "../Tag";
import { NoResults } from "./NoResults";
import { ServerTile } from "./ServerTile";
import { ServerTileSkeleton } from "./ServerTile.skeleton";

interface ResultsProps {
  results: Server[];
  onClick: (id: string) => void;
  tag: "RECENTLY_SEARCHED" | "SEARCH_RESULTS";
  loading: boolean;
  query?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const Results = memo(
  ({
    results,
    onClick,
    tag,
    loading,
    query,
  }: ResultsProps): React.JSX.Element | null => {
    const [finalResults, setFinalResults] = useState<Server[]>(results);

    useEffect(() => {
      if (!_.isEqual(results, finalResults)) {
        setFinalResults(results);
      }
    }, [results, finalResults]);

    if (loading && !_.isEqual(results, finalResults)) {
      return (
        <motion.div
          className="flex min-h-32 flex-col gap-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array(1)
            .fill(0)
            .map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ServerTileSkeleton />
              </motion.div>
            ))}
        </motion.div>
      );
    }

    if (finalResults.length === 0) {
      switch (tag) {
        case "RECENTLY_SEARCHED": {
          return null;
        }
        case "SEARCH_RESULTS": {
          return (
            <NoResults query={query} onClick={() => onClick(query ?? "")} />
          );
        }
      }
    }

    return (
      <div className="flex flex-col gap-2 border-t-2 border-[#444] px-4 pb-4 pt-2">
        {tag === "RECENTLY_SEARCHED" && <Tag>Recently searched servers</Tag>}
        {tag === "SEARCH_RESULTS" && <Tag>Search Results</Tag>}

        <motion.div
          className="flex flex-col gap-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {finalResults.map((result) => (
            <motion.div key={result.id} variants={itemVariants}>
              <ServerTile
                onClick={() => onClick(result.id)}
                hostname={result.hostname}
                imageSrc={`/api/image-proxy?url=${encodeURIComponent(
                  result.image,
                )}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  },
);

Results.displayName = "Results";
