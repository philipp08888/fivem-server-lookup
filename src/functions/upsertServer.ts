"use server";

import { prisma } from "@/src/prisma";
import xss from "xss";

/**
 * Updates or creates persistent server data
 * @param id cfx id of the server
 * @param hostname hostname of the server
 * @param image image value of server
 */
async function upsertServer(id: string, hostname: string, image: string) {
  if (!id || !hostname || !image) {
    throw new globalThis.Error(
      "id, hostname, and image are required and cannot be null or empty.",
    );
  }

  const sanitizedName = xss(hostname);

  try {
    await prisma.server.upsert({
      where: { id: id },
      update: { hostname: sanitizedName, image: image },
      create: {
        id: id,
        hostname: sanitizedName,
        image: image,
      },
    });
  } catch (error) {
    console.error("Error while saving server:", error);
    throw error;
  }
}

export default upsertServer;
