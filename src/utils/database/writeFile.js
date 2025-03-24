const fs = require("fs");

const writeFile = ({ filePathFolder, filePathFile, data }) => {
  if (!fs.existsSync(filePathFolder)) {
    fs.mkdirSync(filePathFolder, { recursive: true });
  }

  fs.writeFileSync(filePathFile, JSON.stringify(data, null, 2));
};
exports.writeFile = writeFile;
