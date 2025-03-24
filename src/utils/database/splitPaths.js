const path = require("path");
const {
  CACHE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
} = require("../../constants/database/cache");

const splitPaths = ({
  filePath,
  baseFolderPath = CACHE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
}) => {
  const fileName = filePath.split("/").slice(-1)[0];
  const fileFolders = filePath.split("/").slice(0, -1).join("/");

  // TODO: verify that process.cwd() works in all contexts as a base path
  const filePathFolder = path.join(process.cwd(), baseFolderPath, fileFolders);
  const filePathFile = path.join(filePathFolder, fileName);
  return { filePathFile, filePathFolder };
};

exports.splitPaths = splitPaths;
