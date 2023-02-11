# CanPress

A web-oriented R-markdown style academic text formatting from markdown to HTML,
featuring minimal configurable templates and live preview in the browser.

This is a work in progress.

![](https://i.imgur.com/Ed5UVx8.jpg)

# Installation

It is recommended to use it as a dev dependency in your project, as it has some vulnerabilities.

```
npm i -D canpress
```

For CLI usage on daily basis, it can be installed globally, although make sure you know what you are doing.

```
npm i -g canpress
```

# CLI Usage

```
USAGE
    canpress <input_file.md> <flags>

FLAGS
    -o <path/to/file.html>
        Output rendered HTML to given path. Defaults to the input file name.

    -b <path/to/bibliography.bib>
        Bibliography file path. Defaults to 'bibliography.bib' in working directory.
        This can also be specified in the front-matter of markdown file under 'bibPath' attribute.

    -t <path/to/template.html>
        Custom template file path. The built-in template is used by default.

    -nt
        No template. Produces just the HTML which is supposed to be inside the document body.

    -l
        Live server with preview in the browser. Refreshes when changes are made to markdown file.

    -p <port_number>
        Custom port number for the live server. 8080 by default.
```

Here's a [quick guide on citations and bibliography](https://github.com/CondensedMilk7/canpress/blob/master/doc/md/citation.md)
made possible with [markdown-it-biblatex](https://github.com/arothuis/markdown-it-biblatex).

A quick [overview of maths with KaTeX](https://github.com/CondensedMilk7/canpress/blob/master/doc/md/maths.md) also contains
links to available functions.

# Library Usage

## Basic Usage

```js
const CanPress = require("@condensedmilk/canpress");

// Instantiate canpress with configuration
const canpress = new CanPress({
  // Path to bibliography file
  bibPath: "./bibliography.bib",
  // Path to template
  templatePath: "my-template.html",
  // Use default template (false by default)
  defaultTemplate: false,
  // markdown-it-biblatex plugin configuration
  mdBiblatexConfig: {},
});

// Assuming you have a written markdown file
const result = canpress.render("./input.md", "./bibliography.bib"); // bibliography can also be specified here
console.log(result);
```

For configuring `markdown-it-biblatex`, see [the documentation of the library](https://github.com/arothuis/markdown-it-biblatex#configuration-options).

## Custom MarkdownIt Plugins

Since this library is just a preconfigured extendable collection of `markdown-it` plugins, you can add your own.
CanPress has an instance of `MarkdownIt` as its property.

```js
const canpress = new CanPress({});

canpress.markdownIt.use(require("markdown-it-highlightjs"));
```

## Templates & Templatization

Templates are used to make a plain HTML output more interesting by adding
HTML skeleton, scripts, styles, meta tags, and most importantly - rendering front-matter data and
document body in spots designated by "marks".

A basic template might look like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>[TITLE]</title>
  </head>
  <style>
    body {
      background: black;
      color: white;
    }
  </style>
  <body>
    <main>
      <article>
        <h1>[TITLE]</h1>
        <h2>[AUTHOR]</h2>
        [CONTENT]
      </article>
    </main>
  </body>
</html>
```

If we use the above template for the following markdown text:

```md
---
title: "The Title"
author: "John Doe"
---

This is content
```

We will get the following output:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>The Title</title>
  </head>
  <style>
    body {
      background: black;
      color: white;
    }
  </style>
  <body>
    <main>
      <article>
        <h1>The Title<h1>
        <h2>John Doe</h2>
        <p>This is content</p>
      </article>
    </main>
  </body>
</html>
```

By default CanPress only knows these three marks: `[TITLE]`, `[AUTHOR]`, `[CONTENT]`.
It replaces every instance of these marks with their respective data values in the front matter, the exception being
`[CONTENT]` which represents the markdown document body.

The templatization and marks can be configured.

In `marks` object, each key corresponds to the front-matter key specified in the markdown file.
The values of the front-matter keys then replace the corresponding marks that share the same key in `CanPress.marks` object.

```js
// Default marks. Can be modified.
canpress.marks = {
  content: "[CONTENT]",
  title: "[TITLE]",
  author: "[AUTHOR]",
};
```

The `CanPress.templatize` function places front matter values and markdown body in the template.
The `content` parameter is the parsed markdown file by the [front-matter](https://github.com/jxson/front-matter)
library. All the front-matter attributes are under the `content.attributes` property, while the body is in `content.body`.
The `md` parameter is the instance of `MarkdownIt` that needs to render the markdown body.

```js
// Default templatize function. Can be modified.
canpress.templatize = function (content, template, md) {
  let html = template.replace(canpress.marks.content, md.render(content.body));

  for (const key in canpress.marks) {
    html = html.replaceAll(canpress.marks[key], content.attributes[key] || "");
  }

  return html;
};
```

# Libraries used

This is not a standalone library, but rather a combination of these preconfigured libraries:

- [Markdown It](https://github.com/markdown-it/markdown-it)
- [Markdown It Anchor](https://github.com/valeriangalliat/markdown-it-anchor)
- [Markdown It KaTeX](https://github.com/waylonflinn/markdown-it-katex)
- [Markdown It Table of Contents](https://github.com/cmaas/markdown-it-table-of-contents)
- [Markdown It Biblatex](https://github.com/arothuis/markdown-it-biblatex)

# To do

### General

- Full unit tests coverage
- Documentation on citation, configuration, custom templates, etc.:
  - Make it accessable from the preview template
  - Build it from markdown using this very library (custom little build-doc script)
  - Write tests that makes sure modified documentations in markdown have been built
- Fix occasional infinite refresh loop on live server.
- Use configuration JSON file.

### Library

- Param documentation

### Long-term

- Allow the library to use not just paths to files (input file and bibliography file)
  to render output, but just simple strings. This has to be added to `markdown-it-biblatex`.
