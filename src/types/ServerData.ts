import { ServerDataPlayer } from "./ServerDataPlayer";
import { ServerDataVars } from "./ServerDataVars";

export interface ServerData {
  clients: number;
  hostname: string;
  svMaxclients: number;
  resources: string[];
  upvotePower: number;
  burstPower: number;
  vars: ServerDataVars;
  iconVersion?: number;
  ownerName: string;
  ownerProfile: string;
  ownerAvatar?: string;
  players: ServerDataPlayer[];
  connectEndPoints: string[];
  server?: string;
}
