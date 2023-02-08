const { readFile, fixture } = require("./util");
const CanPress = require("../src/index");

describe("canpress", function () {
  it("can skip templatization", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography.bib"),
    });
    const result = canpress.render(fixture("no-template.md"));
    const expected = readFile(fixture("no-template.html"));
    expect(result).toBe(expected);
  });

  it("does not register markdown-it-biblatex if no bibPath is provided in constructor", function () {
    const canpress = new CanPress({});
    const result = canpress.render(fixture("no-biblatex.md"));
    const expected = readFile(fixture("no-biblatex.html"));
    expect(result).toEqual(expected);
  });

  it("can render citation and bibliography", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography.bib"),
    });
    const result = canpress.render(fixture("make-bibliography.md"));
    const expected = readFile(fixture("make-bibliography.html"));
    expect(result).toBe(expected);
  });

  it("can use bibliography specified in the constructor", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography-2.bib"),
    });
    const result = canpress.render(fixture("bibliography-2.md"));
    const expected = readFile(fixture("bibliography-2.html"));
    expect(result).toBe(expected);
  });

  it("can use bibliography specified in the render function", function () {
    const canpress = new CanPress({});
    const result = canpress.render(
      fixture("bibliography-2.md"),
      fixture("bibliography-2.bib")
    );
    const expected = readFile(fixture("bibliography-2.html"));
    expect(result).toBe(expected);
  });

  it("can render table of contents with anchor headings", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography.bib"),
    });
    const result = canpress.render(fixture("make-toc.md"));
    const expected = readFile(fixture("make-toc.html"));
    expect(result).toBe(expected);
  });

  it("can read front-matter", function () {
    const expected = {
      myStrAttr: "Test",
      myNumAttr: 12,
      myBoolAttr: true,
    };

    const canpress = new CanPress({
      inputPath: fixture("read-front-matter.md"),
      bibPath: fixture("bibliography.bib"),
    });

    const processed = canpress.frontMatter(
      readFile(fixture("read-front-matter.md"))
    );

    const result = processed.attributes;

    expect(result).toEqual(expected);
  });

  it("can use custom template by providing template path", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography.bib"),
      templatePath: fixture("custom-template.html"),
    });

    const result = canpress.render(fixture("use-custom-template.md"));
    const expected = readFile(fixture("use-custom-template.html"));

    expect(result).toEqual(expected);
  });

  it("can have custom templatize function", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography.bib"),
      templatePath: fixture("custom-templatize-template.html"),
    });

    canpress.templatize = function (content, template, md) {
      const result = template
        .replace("[CONTENT]", md.render(content.body))
        .replace("[CUSTOM_THING]", content.attributes.customThing);

      return result;
    };

    const result = canpress.render(fixture("custom-templatize.md"));
    const expected = readFile(fixture("custom-templatize.html"));
    expect(result).toEqual(expected);
  });

  it("can render custom template marks", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography.bib"),
      templatePath: fixture("custom-marks-template.html"),
    });

    canpress.marks = {
      ...canpress.marks,
      docTitle: "[DOC_TITLE]",
      someHeading: "[SOME_HEADING]",
      someParagraph: "[SOME_PARAGRAPH]",
    };

    const result = canpress.render(fixture("custom-marks.md"));
    const expected = readFile(fixture("custom-marks.html"));
    expect(result).toEqual(expected);
  });

  it("can have custom markdown-it-biblatex configuration", function () {
    const canpress = new CanPress({
      bibPath: fixture("bibliography.bib"),
      mdBiblatexConfig: {
        bibliographyTitle: '<h2 class="bibliography-title">References</h2>',
        bibliographyMark: "[references]",
      },
    });

    const result = canpress.render(fixture("md-biblatex-config.md"));
    const expected = readFile(fixture("md-biblatex-config.html"));
    expect(result).toEqual(expected);
  });

  it("can install markdown-it plugin", function () {
    const canpress = new CanPress({});

    canpress.markdownIt.use(require("markdown-it-highlightjs"));

    const result = canpress.render(fixture("install-plugin.md"));
    const expected = readFile(fixture("install-plugin.html"));
    expect(result).toEqual(expected);
  });
});
