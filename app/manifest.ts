import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FiveM Server Lookup",
    short_name: "FiveM Server Lookup",
    description: "Get detailed information about a specific FiveM server",
    start_url: "/",
    display: "standalone",
    background_color: "#222",
    theme_color: "#2D73DD",
  };
}
