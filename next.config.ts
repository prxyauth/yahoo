const nextConfig = {
  output: "export",
  distDir: "yahoo",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: '/yahoo',
  assetPrefix: '/yahoo/',
  env: {
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;