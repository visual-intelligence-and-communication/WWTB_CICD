const fetchAndCache = require("../fetchAndCache");
const {
  GRIST_API_ROUTES,
  GRIST_HEADERS,
} = require("../../../constants/database/grist");
const {
  CACHE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
} = require("../../../constants/database/cache");

const fetchAndCacheGrist = async ({ routeId, filePath }) => {
  const url = GRIST_API_ROUTES()[routeId];
  const requestInit = { headers: GRIST_HEADERS() };
  const options = {
    enabled: true,
    filePath,
    baseFolderPath: CACHE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
  };

  return fetchAndCache(url, requestInit, options);
};

module.exports = fetchAndCacheGrist;
