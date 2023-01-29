const fs = require("fs");
const path = require("path");

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function fixture(filePath) {
  return path.join(__dirname, "fixtures", filePath);
}

module.exports = { readFile, fixture };
