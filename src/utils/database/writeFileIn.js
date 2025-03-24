const {
  REFERENCE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
} = require("../../constants/database/reference");

const { splitPaths } = require("./splitPaths");
const { writeFile } = require("./writeFile");

const writeFileFromBase = ({ data, filePath, baseFolderPath = "public" }) => {
  const { filePathFile, filePathFolder } = splitPaths({
    filePath,
    baseFolderPath,
  });
  writeFile({ filePathFolder, filePathFile, data });
};

const writeAsReference = ({ data, filePath }) => {
  if (process.env.NODE_ENV === "development") {
    writeFileFromBase({
      data,
      filePath,
      baseFolderPath: REFERENCE_FOLDER_FROM_NEXT_STARTUP_SCRIPT,
    });
  }
};

module.exports = { writeAsReference };
