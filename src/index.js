const fs = require("fs");
const path = require("path");
const fm = require("front-matter");
const MarkdownIt = require("markdown-it");
const markdownItBiblatex = require("@arothuis/markdown-it-biblatex");
const mdAnchor = require("markdown-it-anchor");
const mdTableOfContents = require("markdown-it-table-of-contents");
const mdKatex = require("markdown-it-katex");

const DEFAULT_TEMPLATE_PATH = path.join(__dirname, "templates", "base.html");

class CanPress {
  frontMatter = fm;
  marks = {
    content: "[CONTENT]",
    title: "[TITLE]",
    author: "[AUTHOR]",
  };

  constructor({
    // Path to bibliography file
    bibPath,

    // Path to template file - defaults to the included template
    templatePath,

    // Template is not used by default in this library, unlike in CLI.
    defaultTemplate = false,

    // markdown-it-biblatex library configuration
    mdBiblatexConfig,
  }) {
    this.bibPath = bibPath;
    this.defaultTemplate = defaultTemplate;
    this.mdBiblatexConfig = mdBiblatexConfig;
    this.templatePath = templatePath;
    this.defaultTemplatePath = DEFAULT_TEMPLATE_PATH;

    if (this.templatePath && this.defaultTemplate) {
      throw new Error(
        "Cannot have default template enabled with custom template path also specified!"
      );
    }

    // Initialize and preconfigure MarkdownIt plugins
    this.markdownIt = this.configureMarkdownIt();
  }

  render(inputPath, bibPath) {
    if (!inputPath) {
      throw new Error("No inputPath provided");
    }
    const input = fs.readFileSync(inputPath, "utf-8");
    const content = this.frontMatter(input);
    // TODO: make bibPath read from fron-matter testable
    const resolvedBibPath =
      content.attributes.bibPath || bibPath || this.bibPath;

    // This plugin has to be added during render
    // because it throws error when no bibPath is provided
    // but bibPath also needs to be provided from render function.
    if (resolvedBibPath) {
      this.markdownIt.use(markdownItBiblatex, {
        bibPath: resolvedBibPath,
        ...this.mdBiblatexConfig,
      });
    }

    if (!this.defaultTemplate && !this.templatePath) {
      return this.markdownIt.render(content.body);
    } else {
      const template = fs.readFileSync(
        this.defaultTemplate ? this.defaultTemplatePath : this.templatePath,
        "utf-8"
      );
      return this.templatize(content, template, this.markdownIt);
    }
  }

  templatize(content, template, md) {
    let html = template.replace(this.marks.content, md.render(content.body));

    for (const key in this.marks) {
      html = html.replaceAll(this.marks[key], content.attributes[key] || "");
    }

    return html;
  }

  configureMarkdownIt(markdownIt) {
    const md =
      markdownIt ??
      new MarkdownIt({
        linkify: true,
        typographer: true,
      });

    md.use(mdAnchor, {
      permalink: mdAnchor.permalink.headerLink(),
    });

    md.use(mdTableOfContents, {
      containerHeaderHtml: "<h1>Table of Contents</h1>",
      containerClass: "table-of-contents",
    });

    md.use(mdKatex);

    return md;
  }
}

module.exports = CanPress;
