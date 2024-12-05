import { Server } from "@prisma/client";

export const mockServers: Server[] = [
  {
    id: "ABC123",
    hostname: "Test Server ABC",
    image: "#",
  },
  {
    id: "DEF456",
    hostname: "Test Server DEF",
    image: "#",
  },
  {
    id: "GHI789",
    hostname: "Test Server GHI",
    image: "#",
  },
];
