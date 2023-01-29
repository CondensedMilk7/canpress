const fs = require("fs");
const path = require("path");
const CanPress = require("../src/index");

const MD_DOCS_DIR = path.join(__dirname, "..", "doc", "md");
const HTML_DOCS_DIR = path.join(__dirname, "..", "doc", "html");

const mdFiles = fs.readdirSync(MD_DOCS_DIR);

const canpress = new CanPress({});

mdFiles.forEach((fileName) => {
  const html = canpress.render(path.join(MD_DOCS_DIR, fileName));
  fs.writeFileSync(
    path.join(HTML_DOCS_DIR, fileName.replace(".md", ".html")),
    html
  );
});

console.log(`Documentation built in ${HTML_DOCS_DIR}`);
