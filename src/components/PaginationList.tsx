"use client";

import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useMemo, useState } from "react";

interface PaginationListProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T, index: number) => ReactNode;
  filterKey?: keyof T;
}

export const PaginationList = <T,>({
  items,
  pageSize = 10,
  renderItem,
  filterKey,
}: PaginationListProps<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    return searchQuery
      ? items.filter((item) => {
          if (typeof item === "string" && !filterKey) {
            return item.includes(searchQuery.toLocaleLowerCase());
          }

          return item[filterKey as keyof T]
            ?.toString()
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase());
        })
      : items;
  }, [filterKey, items, searchQuery]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const start = currentPage * pageSize;
  const end = start + pageSize;
  const currentItem = filteredItems.slice(start, end);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const itemHeight = 40;
  const containerHeight = pageSize * itemHeight + pageSize * 8;

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 select-none rounded bg-[#444] p-2 shadow-bg outline-none"
      />

      <div style={{ minHeight: `${containerHeight}px` }}>
        <AnimatePresence mode="wait">
          <motion.ul
            className="flex flex-col gap-2"
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {currentItem.map((item, index) => (
              <motion.li
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                key={start + index}
              >
                {renderItem(item, start + index)}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="rounded bg-white px-4 py-2 font-medium text-black disabled:font-normal disabled:opacity-50"
        >
          Back
        </button>
        <span className="self-center">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage >= totalPages - 1}
          className="rounded bg-white px-4 py-2 font-medium text-black disabled:font-normal disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
