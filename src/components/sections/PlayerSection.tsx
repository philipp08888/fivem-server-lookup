"use client";

import { getPingColor } from "@/src/functions/getPingColor";
import { ServerDataPlayer } from "@/src/types/ServerDataPlayer";
import { Accordion } from "../Accordion";
import { Container } from "../layout/Container";
import { PaginationList } from "../PaginationList";
import { Tag } from "../Tag";

export const PlayerSection = ({ players }: { players: ServerDataPlayer[] }) => {
  return (
    <Container className="gap-2 px-8 py-4">
      <Accordion title={<Tag>Players ({players.length})</Tag>}>
        <PaginationList
          items={players.sort((a, b) => a.id - b.id)}
          pageSize={10}
          filterKey="name"
          renderItem={(player) => (
            <div className="flex items-center justify-between rounded-sm bg-[#444] px-4 py-2 shadow-bg">
              <div className="flex flex-row items-center gap-1">
                <span className="w-12 select-none text-right font-mono text-xs text-[#aaa]">
                  {player.id} |
                </span>
                {player.name}
              </div>
              <div
                style={{ backgroundColor: getPingColor(player.ping) }}
                className="h-2 w-2 rounded-full"
                title={`${player.ping}ms`}
              />
            </div>
          )}
        />
      </Accordion>
    </Container>
  );
};
