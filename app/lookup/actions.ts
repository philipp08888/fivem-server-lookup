"use server";

import { prisma } from "@/src/prisma";
import { Server } from "@prisma/client";

export async function getServersByIds(ids: string[]): Promise<Server[] | null> {
  if (!ids) {
    return null;
  }

  try {
    const serverData = await prisma.server.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (!serverData) {
      return null;
    }

    return serverData;
  } catch {
    return null;
  }
}
