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

## Custom domain

The site is published at https://hhkim17.github.io/iverkim-portfolio/.

To move it to `iverkim.com`, in this order:

1. Register the domain.
2. At the registrar, add these DNS records:

   | type | name | value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | hhkim17.github.io |

3. Wait for the records to resolve (`dig +short iverkim.com` should return the
   four addresses).
4. Set `CUSTOM_DOMAIN = 'iverkim.com'` in `build-c.js` and push.
5. In the repository's Pages settings, enter the domain and enable
   "Enforce HTTPS" once the certificate is issued.

Step 4 before step 3 takes the site offline: Pages redirects the github.io
address to the custom domain as soon as a CNAME file exists.
