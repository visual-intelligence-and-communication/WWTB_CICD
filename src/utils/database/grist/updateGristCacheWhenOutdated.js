const fs = require("fs");
const path = require("path");

const {
  GRIST_API_ROUTES,
  GRIST_DATA_PATH,
  GRIST_DATABASE_FILE_PATH,
  GRIST_HEADERS,
} = require("../../../constants/database/grist");
const {
  CACHE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
} = require("../../../constants/database/cache");
const { updateDatabaseCache } = require("./gristSections");

async function updateGristCacheWhenOutdated() {
  const databaseCacheFilePath = path.join(
    process.cwd(),
    CACHE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
    GRIST_DATABASE_FILE_PATH
  );

  if (fs.existsSync(databaseCacheFilePath)) {
    try {
      const response = await fetch(GRIST_API_ROUTES().database, {
        headers: GRIST_HEADERS(),
      });

      if (!response.ok) {
        throw new Error(`[${response.status}] ${response.statusText}`);
      }

      const current = await response.json();
      const cached = JSON.parse(fs.readFileSync(databaseCacheFilePath));

      const isOutdated =
        new Date(current.updatedAt).getTime() >
        new Date(cached.updatedAt).getTime();

      if (isOutdated) {
        wipeGristData();
        await updateDatabaseCache();
      }
    } catch (error) {
      console.warn(
        "⚠️ Your grist cache might be outdated, requesting grist resulted in the following error:"
      );
      console.error(error);
    }
  } else {
    try {
      await updateDatabaseCache();
    } catch (error) {
      console.error("⚠️ No connection to grist and missing cache.");
      console.warn(
        "You will only see mock data and might run into exceptions."
      );
      console.warn("ℹ️ Verify environment variables are set.");
      console.error(error);
    }
  }
}

function wipeGristData() {
  const gristDataPath = path.join(
    process.cwd(),
    CACHE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
    GRIST_DATA_PATH
  );
  fs.rmSync(gristDataPath, { recursive: true, force: true });
}

module.exports = { updateGristCacheWhenOutdated };
