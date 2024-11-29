"use client";

import { getPingColor } from "@/src/functions/getPingColor";
import { ServerDataPlayer } from "@/src/types/ServerDataPlayer";
import { Accordion } from "../Accordion";
import { Container } from "../layout/Container";
import { PaginationList } from "../PaginationList";
import { Tag } from "../Tag";

export const PlayerSection = ({ players }: { players: ServerDataPlayer[] }) => {
  return (
    <Container className="px-8 py-4 gap-2">
      <Accordion title={<Tag>Players ({players.length})</Tag>}>
        <PaginationList
          items={players.sort((a, b) => a.id - b.id)}
          pageSize={10}
          filterKey="name"
          renderItem={(player) => (
            <div className="flex justify-between items-center py-2 px-4 bg-[#444] shadow-bg rounded-sm">
              <div className="flex flex-row gap-1 items-center">
                <span className="font-mono text-[#aaa] text-xs select-none w-12 text-right">
                  {player.id} |
                </span>
                {player.name}
              </div>
              <div
                style={{ backgroundColor: getPingColor(player.ping) }}
                className="rounded-full h-2 w-2"
                title={`${player.ping}ms`}
              />
            </div>
          )}
        />
      </Accordion>
    </Container>
  );
};
