/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/laion-400-open-dataset",
        destination: "/blog/laion-400-open-dataset",
        permanent: true,
      },
      {
        source: "/laion-5b-a-new-era-of-open-large-scale-multi-modal-datasets",
        destination: "/blog/laion-5b",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
