import type { NextConfig } from "next";

/** GitHub Pages 빌드에서만 basePath 적용 (로컬 dev는 루트 `/`) */
const basePath =
  process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_BASE_PATH
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
