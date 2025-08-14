import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true, // garante minificação do JS
  experimental: {
    modularizeImports: {
      "lucide-react": {
        transform: "lucide-react/icons/{{member}}",
      },
    },
  },
};

export default nextConfig;
