# Clases Pádel Valencia — Manu Carrilero

Sitio web oficial de los servicios de entrenamiento y clases de pádel de **Manu Carrilero** (Elite 22, Paterna — Valencia). Es un sitio **estático** en HTML5 publicado en **GitHub Pages** con dominio propio `clasespadelvalencia.com`.

---

## ⚙️ Stack Tecnológico

- **HTML5 estático y semántico** — sin framework, bundler ni build step.
- **CSS crítico compilado a mano e inline** en el `<head>` de cada página (una sola etiqueta `<style>` con únicamente las clases usadas en esa página).
- **Iconos SVG inline** (`<svg>`), sin librerías de iconos.
- **Cero dependencias CDN en producción**: no se usa `cdn.tailwindcss.com` ni `unpkg.com/lucide`. El único script externo permitido es Google Tag Manager (`gtag.js`, ID `G-HT4WB8DKEV`).
- **Imágenes en formato `.avif`** exclusivamente (optimización con `sharp`).
- **Datos estructurados Schema.org** (`SportsActivityLocation`, `BlogPosting`, `FAQPage`).
- **Alojamiento**: GitHub Pages con dominio personalizado (`CNAME` → `clasespadelvalencia.com`).

> Reglas detalladas de WPO, SEO y markup: [`MANUAL_DIRECTRICES_TECNICAS.md`](./MANUAL_DIRECTRICES_TECNICAS.md).
> Directrices para agentes de IA: [`AGENTS.md`](./AGENTS.md).

---

## 🌍 Arquitectura Bilingüe (ES / EN)

Estructura de idiomas espejo enlazada con etiquetas `hreflang` (+ `canonical` y `og:*`) para SEO internacional.

**Páginas principales**

| Español | English |
|---|---|
| `index.html` | `index-en.html` |
| `sobre-mi.html` | `about-me.html` |
| `blog.html` | `blog-en.html` |

**Artículos del blog**

| Español | English |
|---|---|
| `guia-iniciacion-padel.html` | `padel-beginners-guide.html` |
| `tecnica-tradicional-padel-estancamiento.html` | `traditional-technique-padel-stagnation.html` |
| `empunadura-continental-padel-errores.html` | `padel-continental-grip-mistakes.html` |
| `por-que-no-ensenar-contrapared-padel.html` | `why-i-never-teach-the-boast-padel.html` |
| `formatos-clases-padel-valencia.html` | `padel-classes-valencia-group-vs-individual.html` |
| `cuanto-cuestan-clases-padel-valencia-precios.html` | `how-much-padel-lessons-cost-valencia-prices.html` |
| `mejores-clubes-padel-valencia.html` | `best-padel-clubs-valencia.html` |
| `biomecanica-lesiones-codo-padel.html` | `padel-elbow-injury-biomechanics.html` |
| `video-analisis-grabarse-jugando-padel.html` | `video-analysis-recording-yourself-padel.html` |
| `clases-padel-ninos-valencia-escuela-infantil.html` | `kids-padel-lessons-valencia-junior-academy.html` |

**Páginas legales** (con `noindex`, no aparecen en el sitemap): `condiciones.html`, `terms.html`.

---

## 🗂️ Estructura del proyecto

```
*.html                      Páginas del sitio (raíz, para GitHub Pages)
*.avif                      Imágenes optimizadas (raíz)
scripts/actualizar_blog.py  Robot: tarjetas de blog, home y sitemap
scripts/optimizar-imagenes.mjs  Pipeline de imágenes (JPG/PNG → AVIF con sharp)
.github/workflows/auto-blog.yml Ejecuta el robot en cada push
docs/agentes/               Directrices de rol (arquitectura, redacción SEO, negocio/leads)
.opencode/                  Skills y comandos para agentes de OpenCode
img-originales/             Originarios sin optimizar (ignorado por git)
sitemap.xml, robots.txt, CNAME
```

---

## 🤖 Automatización

### Blog, home y sitemap

`scripts/actualizar_blog.py` recorre los `.html`, extrae metadatos y:

1. Añade las tarjetas nuevas en `blog.html` / `blog-en.html` (entre `<!-- BLOG-LIST-START -->` y `<!-- BLOG-LIST-END -->`).
2. Actualiza el último artículo en `index.html` / `index-en.html` (entre `<!-- HOME-LATEST-START -->` y `<!-- HOME-LATEST-END -->`).
3. Regenera `sitemap.xml`.

```bash
python scripts/actualizar_blog.py
```

`.github/workflows/auto-blog.yml` lo ejecuta automáticamente en cada push de `*.html` a `main` y, si hay cambios, hace commit como `github-actions[bot]` con `[skip ci]`.

> ⚠️ **No borres ni renombres los marcadores `<!-- ... -->`**: el robot los necesita.

### Imágenes (AVIF)

```bash
npm install                          # una sola vez (instala sharp)
npm run optimizar:imagenes           # procesa todo img-originales/
npm run optimizar:imagenes -- --use hero foto.jpg
npm run optimizar:imagenes -- --ratio 16:9 --focus attention foto.jpg
```

Presets `--use hero|card|thumb`, recorte (`--ratio`, `--focus`, `--crop`) y compresión automática hasta el peso objetivo (`--max-kb`). El script imprime las dimensiones finales para los atributos `width`/`height` del `<img>`.

---

## 🚀 Flujo de trabajo

Debido a la automatización, **sincroniza siempre antes de empezar**:

```bash
git pull --rebase --autostash origin main
```

Para publicar un artículo nuevo:

1. Crea el `.html` ES y su espejo EN (partiendo de una plantilla ya conforme).
2. Añade las imágenes a `img-originales/` y genera los `.avif`.
3. Ejecuta `python scripts/actualizar_blog.py`.
4. `git commit` → `git pull --rebase origin main` → `git push`.

---

## 📱 Contacto y reservas

Integración directa con la API de WhatsApp (`+34 622 04 19 11`) para reservas y dudas, con eventos de conversión en Google Analytics (`clic_whatsapp`) y un `origen` único por página y posición.
