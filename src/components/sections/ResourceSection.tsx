"use client";

import { Accordion } from "../Accordion";
import { Container } from "../layout/Container";
import { PaginationList } from "../PaginationList";
import { Tag } from "../Tag";
import { memo } from "react";
import { CfxApiResource } from "@/src/clients/CfxApiClient";

interface ResourceSectionProps {
  resources: Array<CfxApiResource>;
}

export const ResourceSection = memo(({ resources }: ResourceSectionProps) => {
  return (
    <Container className="gap-2 px-8 py-4">
      <Accordion title={<Tag>Resources ({resources.length})</Tag>}>
        <PaginationList
          items={resources}
          pageSize={10}
          renderItem={(resource) => (
            <div className="flex items-center justify-between rounded-sm bg-[#444] px-4 py-2 shadow-bg">
              {resource}
            </div>
          )}
        />
      </Accordion>
    </Container>
  );
});

ResourceSection.displayName = "ResourceSection";
