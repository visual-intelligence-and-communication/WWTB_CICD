const fs = require("fs");
const { splitPaths } = require("./splitPaths");
const { writeFile } = require("./writeFile");

const defaults = {
  baseFolderPath: "data",
  enabled: process.env.ENABLE_CACHE === "TRUE",
  filePath: "data.json",
};

const fetchAndCache = async (
  requestInfo,
  requestInit,
  {
    baseFolderPath = defaults.baseFolderPath,
    enabled = defaults.enabled,
    filePath = defaults.filePath,
  } = defaults
) => {
  const { filePathFile, filePathFolder } = splitPaths({
    filePath,
    baseFolderPath,
  });

  // a. Read & early return
  if (enabled && fs.existsSync(filePathFile)) {
    const rawFile = fs.readFileSync(filePathFile);

    console.info(`🚀 ${filePath} loaded from cache`);
    return JSON.parse(rawFile);
  }

  // b.1. Fetch
  const response = await fetch(requestInfo, requestInit);
  if (!response.ok) {
    throw new Error(`[${response.status}] ${response.statusText}`);
  }

  const data = await response.json();

  // b.2. Write
  if (enabled) {
    writeFile({ filePathFolder, filePathFile, data });
    console.info(`🗄️ ${filePath} stored in cache`);
  }

  // b.3. Return
  return data;
};

module.exports = fetchAndCache;
