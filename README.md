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

The site is served at **https://iverkim.com**, with
https://hhkim17.github.io/iverkim-portfolio/ still working as the origin.

The domain is registered through Cloudflare, whose nameservers front GitHub
Pages. `build-c.js` emits `c/CNAME` from `CUSTOM_DOMAIN`, which is what tells
Pages the domain belongs to this repository — the file has to be inside the
uploaded artifact, because Pages is built by Actions rather than from a branch.

Two things follow from Cloudflare proxying (the orange cloud):

- TLS is terminated at Cloudflare's edge, so the certificate visitors see is
  Cloudflare's, not GitHub's. GitHub's own "Enforce HTTPS" cannot be switched
  on while the proxy is up, because GitHub cannot reach the domain to validate
  it. Setting `cname` through the API also fails if `https_enforced` is sent in
  the same call — send `cname` alone.
- http:// is not redirected to https:// by GitHub. Turn on **SSL/TLS → Edge
  Certificates → Always Use HTTPS** in the Cloudflare dashboard, and make sure
  the SSL mode is **Full**, not Flexible.
