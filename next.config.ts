import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "servers-frontend.fivem.net",
        port: "",
        pathname: "/api/servers/icon/**",
      },
    ],
  },
};

export default nextConfig;