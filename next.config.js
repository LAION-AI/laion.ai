/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/laion.ai/",
  publicRuntimeConfig: {
    basePath: "/laion.ai",
  },
  basePath: "/laion.ai",
};

module.exports = nextConfig;
