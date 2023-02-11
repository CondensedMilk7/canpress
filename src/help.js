module.exports = `USAGE
    canpress <input_file.md> <flags>

FLAGS
    -o <path/to/file.html>
        Output rendered HTML to given path. Defaults to the input file name.

    -b <path/to/bibliography.bib>
        Bibliography file path. Defaults to 'bibliography.bib' in working directory.
        This can also be specified in the front-matter of markdown file under 'bibPath' attribute.

    -t <path/to/template.html>
        Custom template file path. The Built-in template is used by default.
    
    -nt
        No template. Produces just the HTML which is supposed to be inside the document body.

    -l
        Live server with preview in the browser. Refreshes when changes are made to markdown file.

    -p <port_number>
        Custom port number for the live server. 8080 by default.
`;
