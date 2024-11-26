"use client";

import { ServerDataPlayer } from "@/src/types/ServerDataPlayer";
import { getPingColor } from "@/src/utils/getPingColor";
import { Container } from "../layout/Container";
import { PaginationList } from "../PaginationList";
import { Tag } from "../Tag";

export const PlayerSection = ({ players }: { players: ServerDataPlayer[] }) => {
  return (
    <Container className="px-8 py-4 gap-2">
      <Tag>Players ({players.length})</Tag>
      <PaginationList
        items={players}
        pageSize={10}
        filterKey="name"
        renderItem={(player) => (
          <div className="flex justify-between items-center py-2 px-4 bg-[#444] shadow-bg rounded-sm">
            {player.name}
            <div
              style={{ backgroundColor: getPingColor(player.ping) }}
              className="rounded-full h-2 w-2"
              title={`${player.ping}ms`}
            />
          </div>
        )}
      />
    </Container>
  );
};
