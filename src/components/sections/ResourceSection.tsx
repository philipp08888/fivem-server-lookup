"use client";

import { ServerData } from "@/src/types/ServerData";
import { Accordion } from "../Accordion";
import { Container } from "../layout/Container";
import { PaginationList } from "../PaginationList";
import { Tag } from "../Tag";

interface ResourceSectionProps {
  resources: ServerData["resources"];
}

export const ResourceSection = ({ resources }: ResourceSectionProps) => {
  return (
    <Container className="px-8 py-4 gap-2">
      <Accordion title={<Tag>Resources ({resources.length})</Tag>}>
        <PaginationList
          items={resources}
          pageSize={10}
          renderItem={(resource) => (
            <div className="flex justify-between items-center py-2 px-4 bg-[#444] shadow-bg rounded-sm">
              {resource}
            </div>
          )}
        />
      </Accordion>
    </Container>
  );
};
