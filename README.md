# iverkim.com — portfolio

Static site for Iver Kim. Source lives here; the site is built by GitHub Actions
and published to GitHub Pages on every push to `main`.

## Build locally

```bash
node build-c.js          # generates the site into c/
node build-single-c.js   # one-file preview: iverkim-C-index.html
cd c && python3 -m http.server 8000
```

`c/` is build output and is not committed — see `.gitignore`.

## Where things live

| file | what it is |
|---|---|
| `works.js` | The works index. One entry per work: medium tags, kind, thumbnail, detail payload. |
| `content.js` | Bio, CV, discography, residencies, drawings, contact. |
| `build-c.js` | All CSS and page templates. Generates every page. |
| `build-single-c.js` | Bundles the built site into one self-contained HTML file. |
| `assets/` | Image sources. Copied to `c/img/` on build. |

See `HANDOFF.md` for project state, design references and open questions.
