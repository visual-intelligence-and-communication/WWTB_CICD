/** @type {import('next').NextConfig} */
const {
  updateGristCacheWhenOutdated,
} = require("./src/utils/database/grist/updateGristCacheWhenOutdated");

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["localhost", "wwtb-cms.decolonize-berlin.de", "https://wwtb-cms.decolonize-berlin.de"], // Add your domain without protocol and port
    formats: ['image/avif', 'image/webp'], // .jpg -> .webp
  },
  env: {
    ENABLE_CACHE: process.env.ENABLE_CACHE,
    GRIST_API_KEY: process.env.GRIST_API_KEY,
    GRIST_BASE_URL: process.env.GRIST_BASE_URL,
    GRIST_DOC_ID: process.env.GRIST_DOC_ID,
    KIRBY_PASSWORD: process.env.KIRBY_PASSWORD,
    KIRBY_USERNAME: process.env.KIRBY_USERNAME,
    KIRBY_URL: process.env.KIRBY_URL,
    KIRBY_URL_FOR_FILE: process.env.KIRBY_URL_FOR_FILE,
    NEXT_PUBLIC_MATOMO_URL: process.env.NEXT_PUBLIC_MATOMO_URL,
    NEXT_PUBLIC_MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  }
};
module.exports = async (phase, { defaultConfig }) => {
  try {
    await updateGristCacheWhenOutdated();
  } catch (error) {
    console.error('Failed to update Grist cache:', error);
    // Optionally, handle the error or proceed without updating
  }

  return nextConfig;
};

