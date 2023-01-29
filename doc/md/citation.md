---
title: "Citation"
---

To make citation possible there must be a `bibliography.bib` file in the root directory, or it's path should be manually specified with `-b` flag.

example `bibliography.bib`:

```bib
@incollection{allport35,
  title = "Attitudes",
  author = "Allport, G. W.",
  year = "1935",
  booktitle = "A Handbook of Social Psychology",
  pages = "798-844",
  location = "Worcester, MA, US ",
  publisher = "Clark University Press",
}

@article{murray99,
  author = "Murray, David J. and Ellis, Robert R. and Bandomir, Christina A. and
            Ross, Helen E.",
  title = "Charpentier (1891) on size-weight illusion",
  year = "1991",
  journal = "Perception \& Psychophysics",
  volume = "61 (8)",
  pages = "1681-1685",
  doi = "10.3758/BF03213127",
}

@book{nadirashvili83,
  author = "Nadirashvili, Shota",
  title = "განწყობის ფსიქოლოგია",
  year = "1983",
  publisher = "მეცნიერება",
  location = "თბილისი",
  volume = "1",
}
```

We can use the citation keys that will be formatted and have bibliography generated in the place of `[bibliography]` marker.

```
A bibliography [@allport35] is generated only for the cited items [@nadirashvili83].

[bibliography]
```

The above input will produce the following output:

```
<p>A bibliography (Allport, 1935) is generated only for the cited items (Nadirashvili, 1983).</p>
<div class="bibliography">
<h2 class="bibliography-title">Bibliography</h2>
<div class="bibliography-contents">
  <div class="csl-entry">Allport, G. W. (1935). Attitudes. In <i>A handbook of social psychology</i> (pp. 798–844). Worcester, MA, US: Clark University Press.</div>
  <div class="csl-entry">Nadirashvili, S. (1983). განწყობის ფსიქოლოგია (Vol. 1). თბილისი: მეცნიერება.</div>
</div>
</div>
```

# Syntax

### Prefix

| Input               | Output                |
| ------------------- | --------------------- |
| `[@allport35{see}]` | `(see Allport, 1935)` |

### Locator

| Input                     | Output                       |
| ------------------------- | ---------------------------- |
| `[@allport35#p. 52]`      | `(Allport, 1935, p. 52)`     |
| `[@allport35#p. 52{see}]` | `(see Allport, 1935, p. 52)` |

### Citation Modes

| Syntax          | Description          | Output            |
| --------------- | -------------------- | ----------------- |
| `[@allport35]`  | `Regular citation`   | `(Allport, 1935)` |
| `[!@allport35]` | `Author only`        | `Allport`         |
| `[-@allport35]` | `Supress author`     | `(1935)`          |
| `[~@allport35]` | `Composite citation` | `Allport (1935)`  |

### Multiple Citations

A semicolon (`;`) is used for multiple sources in a single citation.

| Input                           | Output                                |
| ------------------------------- | ------------------------------------- |
| `[@nadirashvili89; @allport35]` | `(Nadirashvili, 1989; Allport, 1935)` |
