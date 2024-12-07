"use server";

import { ServerData } from "@/src/types/ServerData";

/**
 *
 * @param query cfx server id of the server
 * @returns returns data object of server relevant details
 */
async function fetchDataFromAPI(query: string) {
  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${query}`,
    );

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.statusText}`);
      return null;
    }

    const { Data: data }: { Data: ServerData | null } = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", (error as Error).message);
    return null;
  }
}

export default fetchDataFromAPI;
