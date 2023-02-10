#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const liveServer = require("dead-server");
const CanPress = require("./index");

const OUTPUT_PATH = __dirname;
const BIB_PATH = path.join(".", "bibliography.bib");
const PORT = 8080;

const args = process.argv;
let inputPath;
let bibPath = fs.existsSync(BIB_PATH) ? BIB_PATH : null;
let outputPath = OUTPUT_PATH;
let templatePath = null;
let defaultTemplate = true;
let port = null;

// TODO: cleaner arguments handling

if (args.includes("-h")) {
  help();
  return;
}

if (args[2]) {
  inputPath = args[2];
  console.log("Reading file", inputPath);
} else {
  panic("Must provide input file as the first argument!");
}

if (args.includes("-o")) {
  outputPath = args[args.indexOf("-o") + 1];
  if (!outputPath.endsWith(".html")) {
    panic("Output path must include file name with '.html' extension!");
  }
} else {
  outputPath = inputPath.replace(".md", ".html");
}

if (args.includes("-b")) {
  bibPath = args[args.indexOf("-b") + 1];
  if (!bibPath.endsWith(".bib")) {
    panic("Invalid bibliography file!");
  }
}

if (args.includes("-t")) {
  templatePath = args[args.indexOf("-t") + 1];
  defaultTemplate = false;
  if (!templatePath.endsWith(".html")) {
    panic("Invalid template file!");
  }
}

if (args.includes("-nt")) {
  defaultTemplate = false;
}

if (args.includes("-p")) {
  port = args[args.indexOf("-p") + 1];
  if (!port) {
    panic("Must provide a port if -p flag is used!");
  }
}

if (args.includes("-l")) {
  const params = {
    port: Number(port) || PORT,
    host: "0.0.0.0",
    open: true,
    ignore: "/*.md", // Markdown can be ignored because rendered html is enough to trigger reload
    file: outputPath, // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    // mount: [["/components", "./node_modules"]], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [
      function (req, res, next) {
        renderAndWrite();
        next();
      },
    ],
  };

  liveServer.start(params);
} else {
  renderAndWrite();
}

function renderAndWrite() {
  const canpress = new CanPress({ bibPath, templatePath, defaultTemplate });
  const doc = canpress.render(inputPath);

  fs.writeFileSync(outputPath, doc, {
    encoding: "utf-8",
  });

  console.log("Written file to", outputPath);
}

function panic(message) {
  console.log(message);
  help();
  process.exit(1);
}

function help() {
  console.log(require("./help"));
}
