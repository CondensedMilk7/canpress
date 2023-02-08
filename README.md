# CanPress

A web-oriented R-markdown style academic text formatting from markdown to HTML,
featuring minimal configurable templates and live preview in the browser.

This is a work in progress.

![](https://i.imgur.com/Ed5UVx8.jpg)

# CLI Usage

for now CLI testing is done by installing it globally from project root (after cloning it):

```sh
npm i -g .
```

```
USAGE
    canpress <input_file.md> <flags>

FLAGS
    -o <path/to/file.html>
        Output rendered HTML to given path defaults to input file name.

    -b <path/to/bibliography.bib>
        Bibliography file path. Defaults to 'bibliography.bib' in working directory.
        This can also be specified in the front-matter of markdown file under 'bibPath' attribute.

    -t <path/to/template.html>
        Custom template file path. The Built-in template is used by default.

    -nt
        No template. Produces just the HTML which is supposed to by inside the document body.

    -l
        Live server with preview in the browser. Refreshes when changes are made to markdown file.

    -p <port_number>
        Custom port number. 8080 by default.

```

# Libraries used

This is not a stabdalone library, but rather a combination of these preconfigured libraries:

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
- Documentation on library usage
- Make it possible to link external HTML and CSS to templates (path resolution problem)
- Fix occasional infinite refresh loop on live server.
- Use configuration JSON file.

### Library

- Param documentation

### Long-term

- Allow the library to use not just paths to files (input file and bibliography file)
  to render output, but just simple strings. Might have to use my own fork of markdown-it-biblatex
  as it doesn't work without bibliography file path.
