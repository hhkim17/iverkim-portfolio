# Iver Kim portfolio — project state

Static portfolio site rebuilt from the old Framer site (iverkim.framer.website).

## Run it

```bash
node build-c.js          # regenerates c/  (the site)
node build-single-c.js   # regenerates iverkim-C-index.html (one-file preview)
cd c && python3 -m http.server 8000
```

## Files

| file | what it is |
|---|---|
| `content.js` | All text: bio, CV, sound (releases / dj sets / live / collaborations), photography, drawings, contact. |
| `works.js` | The unified works index (26 entries). `m:` = medium tags, `k:` = kind, `w:` = collaborator, `link:`/`href:` = detail target. |
| `build-c.js` | Generates the site into `c/`. Contains all CSS, page templates, and the `MEDIA` tag vocabulary. |
| `build-single-c.js` | Bundles `c/` into one self-contained HTML with hash routing. |
| `c/` | Build output — don't edit by hand, it gets overwritten. |
| `assets/` | Local image sources: `paintings/` (19, from the 2025.8 portfolio PDF), `intermedia/` (18 icon thumbnails from the old Framer site), `releases/` (6 covers), `karts/` (21 from kartsfaa.org — k19–k23 are installation views of *Dew on the eye*, the rest are lower-resolution duplicates of paintings we already have at higher res). `freight.cargo.site` blocks hotlinking, so those needed `curl -e https://kartsfaa.org/`. Originally: `build-c.js` copies the whole tree to `c/img/` on every build. `assets/paintings/` holds the 19 paintings extracted from the 2025.8 portfolio PDF. |

## Medium vocabulary

`MEDIA` in build-c.js:10 — order here is the display order in tag arrays.

    sound · intermedia · video · performance · installation · photography · painting · drawing

`video` was added 2026-08 for *The Trained Gaze*. `drawing` is currently unused (see gap 1).

## Editorial voice

The invented page intros ("An ongoing archive of images and field recordings…" etc.) were removed at the artist's request — `intro` fields are now empty strings and the nav `blurb` fields are gone. Do not reintroduce descriptive flavour text; captions and metadata only.

## Design

- White, no accent colour. Left index fixed on every page; the active item goes **lighter** (`#BDB7AC`), not darker.
- Type: **Redaction** (Forest Young & Jeremy Mickel, OFL) for body and display, **Supreme** (Indian Type Foundry) for the small lowercase metadata labels. Both from CDN via `@import` at the top of the CSS block in `build-c.js`.
- Home is a single image, auto-advancing randomly every 5s with a 0.7s fade. No manual controls.
- `works.html` is the spine: one list, toggled between by-medium and by-year. Deep links: `works.html#m-sound`, `works.html#y-2023`.
- `sound.html` order is **releases → dj sets → live & performance → scores**. Releases lead deliberately — they are the most important output.
- Release detail pages are generated as `release-<slug>.html` for any release with a `page:` object. Album covers link there; releases without a detail page link straight to Bandcamp.

Reference sites the design came from: inbetweennoise.com (Steve Roden) and christineodlund.se (left index + one image at a time, faded active state).

## Source material

Authoritative CVs and portfolios live on an external volume:

    /Volumes/Extreme SSD/DOCUMENTS/Portfolio, CV/

Most useful so far — extract with `pdftotext -layout`:

- `2025/CV_2025.2.pdf` — latest CV (Korean). Contains works missing from the site.
- `2025/포트폴리오_2025.8(페인팅+인터미디어).pdf` — painting + intermedia, with titles/years/media/dimensions.
- `2024/portfolio_2024.4/portfolio_2024.4.20.pdf`, `2023/Hwan Hee Kim_Portfolio(04.2023HKUmasters).pdf` — not yet mined.

External references used for the d³ pages: the d³ EPK (Notion) and the Korean Indie interview (Feb 2025). Album copy on the detail page is taken from the artist's own EPK only — the interview is third-party and is linked, not quoted.

## Known gaps

1. **`drawing` tag is still unused in works.js.** The paintings themselves now live on `drawings.html` (19 works, extracted from the 2025.8 portfolio into `assets/paintings/`), but the works *index* still lists only painting exhibitions, not the individual works. Short films 2016–2020 are also not yet added (decided: they get the `video` tag).
1b. **The Drawings section is empty.** The 13 images that used to sit there came from the old Framer site and are wrong — photographs of collaborative work, not drawings. They are parked in `content.js` → `drawings.groups[id:'drawings']._wrongImages` and render nowhere. Real drawing files still needed; the collaboration photos should be relocated to whichever project they belong to.
2. **works.js conflates exhibition titles with work titles.** Confirmed cases: *meet me at 1.048596 :)* is the work, 페르소나 사회 is the show; *Milk 'n Fridge* is the work, *K-Arts in Osaka: Communication* is the show. Needs a decision on how to represent both.
3. **works.js has not yet absorbed the CV/portfolio findings.** The English CV (`2024/portfolio_2024.4/IverKim CV-2024.3.pdf`) is the richest source found so far — it gives English titles, roles and collaborators for everything. Still to fold in: the four missing 2022 works (JunYuEumMu; Purun, Zitten, Summer; Jazz Breeze on a lazy morning; Catering Service/avcd), *Waves Piece*, the `dim` interactive music video, the five short films, and role corrections (The Hangout is a DJ set, not a live set; the 2023 barn show was a d³ collective show). Old wording of this gap:
   **Works in the 2025 CV that are missing from works.js**: 전유음무(專有陰霧) 공상온도 2022 · 푸른, 짙은, 여름 SAPY 2022 · Jazz Breeze on a lazy morning SAPY 2022 · Catering Service pixelcounting 2022. Also *Waves Piece* (2024, with Laura Kampman) and the *dim* interactive music video (2022, Unity).
4. **Photography, intermedia and album-cover images are still hotlinked** to `framerusercontent.com` and `f4.bcbits.com`. Paintings are now local. Move the rest into `assets/`.
5. **d³ (deep drone dreamer) is not introduced anywhere** — 2 of 4 releases are under that name. It's a duo with Joon Pyo (milk of the sun); the artist writes the music.
6. *The Very First Cyborg* was removed from intermedia (it is a painting group show) but has no home on `drawings.html` yet.
6b. **`intermedia.html` is now a thumbnail grid** of 18 projects using the icon images from the old Framer site, downloaded into `assets/intermedia/`. Six of those projects are not in works.js at all: A World Observing a World (2025), Pishu 'Penguin' Teaser (2024), computing-composing (2022), Seoul Stage 11 (2022), avcd (2022), Duet / Trio for piano and computer (2021).
6c. **Date conflict**: the old site dates *When Doves Cry.. Rage in Eden* to 2024, both CVs say 2023. Unresolved — works.js currently says 2023.
7. No `news` page, though both reference sites have one.

## Reference spec — inbetweennoise.com (measured, not guessed)

**Index / category page.** Fixed 170×100 thumbnail (17:10), cropped. Column pitch 190px (170 + 20 gap), row pitch 180px. Caption sits **7px** below the image: title in *italic* on its own line, year on the next line, both 11px/16px in grey (#666). Nothing else — no description in the grid.

**Work detail page.** Three zones inside the content area:
- a metadata column (x≈220, ~170px wide): title, then `< back  < prev  next >`, then a counter (`1 / 14`), then a **50×50 thumbnail picker** three-up (60px pitch), then year / medium / dimensions, then a `---` rule, then the description in lowercase prose;
- the selected image large on the right (x≈468, ~436×550);
- left nav unchanged, with the active branch expanded.

Our implementation scales the type up slightly — Redaction sets smaller than Helvetica at the same px — but keeps the 17:10 thumb, the 7px caption gap, the 20px column gap, and the italic-title / year-beneath order. See `.tiles` in build-c.js.

Detail pages must be able to carry, later: multiple detail images, a description, and sometimes audio. `release-*.html` is the first page built to this shape; the work detail pages are not built yet.

## Naming

The artist published earlier as **김환희 / Hwan Hee Kim**. That is a former name — it must not appear anywhere on the site, even though it is still on source pages such as kartsfaa.org. Use **Iver Kim / 김이베** only.

## Direction

The artist wants `works.html` to look and behave like Steve Roden's inbetweennoise.com: a thumbnail grid (image, italic title, year — nothing else), with **by-period and by-category as separate left-nav entries** rather than the current in-page toggle. Roden's nav splits `works` into four date ranges plus six categories, and keeps `discography` as its own top-level branch with solo/collaborations/compilations. Descriptive prose is out; captions and metadata only.

## Nav (implemented)

    index
    works ─ by year   ─ 2025 / 2024 / 2023 / 2022 / 2021
          └ by medium ─ sound / intermedia / video / performance /
                        installation / residency archive / drawings & paintings
    about

The branch expands only on pages that belong to it. A medium points at its own rich page where one exists (`MEDIA_PAGE` in build-c.js) and at a generated `works-m-*.html` otherwise; years are always generated (`works-y-*.html`). `app.js` is now just a shim redirecting the old `works.html#m-…` / `#y-…` deep links to the new pages.

works.js now holds **42 works** (2016–2025); 21 have a thumbnail and 16 have a detail page. The rest render a hatched empty plate. `drawing` is still an unused medium tag.

## Videos

Two works are on Vimeo: *Duet / Trio for Piano and Computer* (662416343, 25:16) and *Till We Have Faces* (662400641, 6:58) — the latter is the work the artist referred to as "facing a face", and is the same piece the portfolio lists as 얼굴 찾기 (2020). Neither is in works.js yet.

## Work detail pages (built)

`work-<slug>.html` is generated for any works.js entry with a `slug` and a `det` payload — meta column (title, counter, 50×50 thumbnail picker, facts, links, text) beside a large stage image, per the reference spec. The picker swaps the stage image with a few lines of inline JS. Entries carrying `statementKo`/`statementEn` also render a two-column bilingual statement below the rule.

The English translation of 「불가능한 대화」 on *Dew on the eye* was made here, not by the artist — it should be read over before the site goes public.

## Where the links came from

PDF link annotations are not recoverable with `pdftotext`; they were pulled by decompressing the PDF streams and grepping for URIs, then identified by resolving each YouTube/Vimeo id through its oEmbed endpoint. That is how ‹Till we have faces 얼굴 찾기 (2020)› was confirmed to be one work under two titles. Repeat that method for any new portfolio PDF.

Unresolved conflicts: the portfolio dates *Untitled* to 2020, YouTube says 2017 (works.js follows YouTube). The old Framer site dates *When Doves Cry.. Rage in Eden* to 2024, both CVs say 2023 (works.js follows the CVs).

## Next steps

- **Mine the 2024 and 2023 portfolio PDFs for images** so every work can have a thumbnail. Survey of `2024/portfolio_2024.4/portfolio_2024.4.20.pdf` (13pp, 44 images): p2 Waves Piece (3), p3 live performance (8), p4–5 Mulsori (10), p6 Rave Geometry (1), p7 Lost Air × ZER01NE (7), p8 milk 'n fridge (1), p9–10 WFS/‹0204› (2), p11–12 dim + interactive MV (3), p13 Dew on the eye (4). The 2023 HKU portfolio (36pp) is still unexamined.
- Restructure `works.js` and the nav to the Roden shape (by-period and by-category as separate pages, releases split solo / collective / collaboration), then build work detail pages to the spec above.
- Resolve the exhibition-vs-work split (option (a): work title leads, exhibition is secondary).
- Deploy: `c/` is plain static files — drop it on Netlify, Vercel, or GitHub Pages as-is.
