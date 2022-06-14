/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/laion.ai/",
  publicRuntimeConfig: {
    basePath: "/laion.ai",
  },
  basePath: "/laion.ai",
  images: {
    loader: "akamai",

    path: `/laion.ai/_next/image`,
  },
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
};

module.exports = nextConfig;
