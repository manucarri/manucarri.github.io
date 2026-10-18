# AGENTS.md — Agent Guidelines for clasespadelvalencia.com

Persistent guidance for AI agents working in this repository. **Read this first.**
Full, detailed rules (with exact markup, icon SVGs and CSS): `MANUAL_DIRECTRICES_TECNICAS.md`.
When this file and the manual overlap, the manual is the source of truth for exact code.

## Project in one line

Static bilingual (ES/EN) website for padel coach **Manu Carrilero** (Elite 22, Paterna, Valencia).
Pure HTML5 + hand-compiled CSS, hosted on **GitHub Pages** with custom domain `clasespadelvalencia.com`.
No build step, no framework, no bundler.

## Start of session (mandatory)

`main` is auto-committed by a GitHub Actions bot, so the remote usually moves ahead.
**Before any local work, sync first** to avoid `non-fast-forward` rejections:

```bash
git pull --rebase origin main
```

## Hard rules (never break these)

1. **Zero CDN dependencies in production HTML.** Never add:
   - `<script src="https://cdn.tailwindcss.com">`
   - `<script src="https://unpkg.com/lucide@latest">`
   - `tailwind.config = {...}` inline blocks
   The only allowed third-party script is Google Tag Manager (`gtag.js`).
2. **All CSS must be hand-compiled and inlined** in a single `<style>` in `<head>`,
   containing ONLY the Tailwind utility classes actually used in THAT file.
   Use the old custom `padel` palette: `50 #f0fdf4`, `100 #dcfce7`, `500 #22c55e`,
   `600 #16a34a`, `900 #14532d`, `accent #f59e0b`. Escape pseudo/responsive selectors
   (`.hover\:bg-padel-600:hover{...}`, `.md\:flex{...}` inside its `@media`).
3. **Icons are inline `<svg>`, never `<i data-lucide="...">`.** Remove any leftover
   `lucide.createIcons()` call. Reuse the SVG paths already documented in the manual (section 3).
4. **Never rewrite or delete SEO blocks**: `canonical`, `hreflang` alternates, `og:*`,
   `application/ld+json` (Schema.org `BlogPosting`/`FAQPage`/`SportsActivityLocation`),
   and the LCP `<link rel="preload" as="image" ... fetchpriority="high">`.
   Verify they exist; do not touch them while restyling.
5. **Footer headings are `<h2>`, never `<h4>`** (only inside `<footer>`; in-article `<h4>` boxes stay).
6. **Local-SEO locality block**: keep the exact 9 localities, in order, with `text-gray-400`
   (Valencia capital, Paterna, La Eliana, San Antonio de Benagéber, Bétera, Mas Camarena,
   Burjassot, Godella, Rocafort). Copy exact ES/EN markup from the manual (section 5.2).
7. **Floating WhatsApp button on every article page**: phone `34622041911`,
   `gtag('event','clic_whatsapp',{'origen':'...'})` with a **unique `origen` per page/position**
   (e.g. `boton_flotante_articulo_<slug>`, `footer_articulo_<slug>`, `cta_articulo_<slug>`).
8. **Keep the ES/EN mirror structure**: every content page has a language counterpart linked
   via `hreflang`. When you edit one language, apply the equivalent change to its mirror.
9. **Do not create throwaway Python scripts to bulk-edit HTML.** If a migration script is
   unavoidable: validate it first with
   `python -c "import ast; ast.parse(open('script.py', encoding='utf-8').read())"`,
   test it, and delete it when done. (A half-finished script once broke the site.)
10. **Never remove or rename the automation markers**: `<!-- BLOG-LIST-START/END -->` in
    `blog.html`/`blog-en.html` and `<!-- HOME-LATEST-START/END -->` in `index.html`/`index-en.html`.
    `scripts/actualizar_blog.py` injects cards there; deleting them breaks auto-publishing.
11. **GA4**: keep the gtag snippet with measurement ID `G-HT4WB8DKEV` on every page.

## Role skills and commands (load on demand)

Specialized roles are packaged as OpenCode skills (`.opencode/skills/`); load them when the task
matches instead of having them always in context:

- **`blog-seo-writer`** — creating/rewriting/expanding blog articles (ES/EN). Encodes the SEO
  robot requirements and the mandatory two-phase workflow (propose slugs/outline/FAQs → wait for OK → code).
- **`negocio-leads`** — pricing, commercial copy, offers, and replying to client leads / price
  objections (official rates: group 3-5 = 69 €/mo, couple = 95 €/mo, individual = 165 €/mo,
  diagnostic = 40 €).
- **`imagenes-avif`** — adding/replacing/optimizing images (JPG/PNG → `.avif` with sharp).
- **`/nuevo-articulo <tema>`** — command that kicks off the bilingual blog workflow.
- **`/optimizar-imagenes`** — command that runs the AVIF image pipeline.

Source documents for these roles: `docs/agentes/01-arquitectura-y-mantenimiento.md`,
`docs/agentes/02-redactor-blog-seo.md`, `docs/agentes/03-negocio-ventas-leads.md`.

## Images (AVIF pipeline)

- The site uses **`.avif` only**. Never reference `.jpg`/`.png`/`.webp` from pages.
- Optimize with **sharp**: put originals in `img-originales/` (gitignored), run `npm install` once,
  then `npm run optimizar:imagenes` (see skill `imagenes-avif` for flags and markup).
- **This agent cannot generate images** — the author supplies the photos.
- Never commit `node_modules/` or `img-originales/`. Do commit `package.json` and `package-lock.json`.
- Naming: descriptive kebab-case, lowercase, tied to the article slug (fix the legacy
  `Profesor-padel-titulado-valencia.avif` capitalization when touched).
- Every `<img>` needs `width`/`height` and a localized `alt`. Secondary images use
  `loading="lazy" decoding="async"`; the LCP hero uses
  `<link rel="preload" as="image" href="..." fetchpriority="high">`.
- Update `og:image` when the image is the article's social cover.

## Reference templates (already compliant — copy their patterns)

`cuanto-cuestan-clases-padel-valencia-precios.html`, `biomecanica-lesiones-codo-padel.html`,
`best-padel-clubs-valencia.html`, `formatos-clases-padel-valencia.html`,
`video-analisis-grabarse-jugando-padel.html`.

**Known non-compliant files (still pending homogenization):**
`blog.html` and `blog-en.html` (CDN Tailwind + Lucide),
`sobre-mi.html` and `about-me.html` (`<i data-lucide>` + `lucide.createIcons()`).
If you work on these, bring them to the standard.

## Publishing workflow

- New article = a new `.html` file at the repo root, kebab-case slug, plus its ES/EN mirror.
- After adding/renaming an article, run: `python scripts/actualizar_blog.py`
  It regenerates blog cards (`<!-- BLOG-LIST-START/END -->` in `blog.html`/`blog-en.html`),
  updates the home (`<!-- HOME-LATEST-START/END -->` in `index.html`/`index-en.html`)
  and rewrites `sitemap.xml`.
- `.github/workflows/auto-blog.yml` re-runs that script on every push of `*.html` to `main`
  and commits as `github-actions[bot]` with `[skip ci]`. Do not fight it: let it commit.
- `condiciones.html` and `terms.html` are `noindex` and must not appear in `sitemap.xml`.

## Git automation & safe commits (never get stuck)

Context: `main` is shared with a GitHub Actions bot that moves on its own. Treat every
push as potentially conflicting and follow this protocol so nothing blocks.

**What the bot does:** `.github/workflows/auto-blog.yml` fires on any push of `*.html` to
`main`, runs `scripts/actualizar_blog.py`, and pushes an auto-commit as
`github-actions[bot]` (message `Auto-update blog, home y sitemap.xml [skip ci]`) touching
`blog.html`, `blog-en.html`, `index.html`, `index-en.html`, `sitemap.xml`.

**Safe protocol when the user asks you to commit/push:**

1. Check the tree: `git status` (stash or finish anything in progress first).
2. **Sync first, always:** `git pull --rebase origin main`.
3. Stage and commit your work with a clear message.
4. `git push`.
5. If the push is rejected (`non-fast-forward`), it means the bot pushed first:
   run `git pull --rebase origin main` again, then `git push`. Repeat if needed.

**Rules:**
- **Never** `git push --force`, never rewrite history on `main`, never merge the bot's
  commit with a merge commit — always `--rebase`.
- Prefer running `python scripts/actualizar_blog.py` **locally** and committing its output
  together with the new article. That keeps the commit self-consistent and, since the
  script is idempotent, the bot will find nothing new and stay quiet.
- If you cannot push (no credentials), say so explicitly and stop — do not leave the repo
  half-committed or retry in a loop.

## Verify before finishing (PowerShell)

```powershell
Select-String -Path *.html -Pattern 'cdn.tailwindcss|unpkg.com/lucide'   # expect: no matches
Select-String -Path *.html -Pattern 'data-lucide|lucide.createIcons'     # expect: no matches
Select-String -Path *.html -Pattern '<h4'                                # footer must not use h4
python scripts/actualizar_blog.py                                        # regenerate blog/home/sitemap
```

Style is the deliverable: changes must match the structure, naming and formatting of the
already-homogenized files. Keep every file valid HTML ending in `</html>`, with `<style>`,
`<footer>` and other tags closed in pairs.
