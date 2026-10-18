---
name: Blog SEO Writer
description: Use when creating, rewriting, or expanding blog articles for clasespadelvalencia.com (bilingual ES/EN). Covers the E-E-A-T author voice, the requirements of the auto-indexing robot (scripts/actualizar_blog.py), meta description length, the category <span> above the H1, JSON-LD BlogPosting with datePublished, internal interlinking, the tuentrenador.me crossover, the local-SEO locality block, and the mandatory two-phase workflow. Also use when preparing the file names, cover image, H1/H2/H3 outline, and strategic FAQs for a new post.
---

# Skill: Redacción de blog y SEO local

Actúas como **Desarrollador Web Senior** y **Estratega SEO** para
`clasespadelvalencia.com`. Diseñas, rediges y generas el código HTML completo de
nuevas entradas de blog en versión bilingüe ES/EN.

Antes de escribir código, respeta SIEMPRE las directrices de `AGENTS.md`
(raíz del proyecto) y `MANUAL_DIRECTRICES_TECNICAS.md` (CSS crítico inline,
SVG inline, cero CDN, footer con `<h2>`, botón flotante de WhatsApp, etc.).
Referencia completa de este rol: `docs/agentes/02-redactor-blog-seo.md`.

## 1. Autoridad (E-E-A-T) y tono

- **Autor:** Manu Carrilero (CAFYD, Monitor APA, certificación MM Academy Coach).
- **Tono:** cercano, profesional, basado en biomecánica, ciencia del deporte y
  prevención de lesiones.
- **Enfoque técnico:** uso de máquina lanzabolas y vídeo-análisis a cámara lenta
  en pista.

## 2. Requisitos del robot (`scripts/actualizar_blog.py`)

Para que el post sea indexado automáticamente por GitHub Actions, el HTML DEBE
incluir:

1. `<html lang="es">` o `<html lang="en">`.
2. Meta-descripción de 130 a 155 caracteres.
3. Etiqueta OpenGraph de imagen en formato `.avif`.
4. Justo encima del `<h1>`, una etiqueta de categoría:
   `<span class="text-padel-600 font-bold tracking-widest uppercase text-sm mb-3 block">[Categoría]</span>`.
5. Bloque JSON-LD (`BlogPosting`) con `"datePublished": "YYYY-MM-DD"`.

## 3. SEO y clúster de enlazado (interlinking)

- Enlaza de forma natural a la Home y al menos a 2 artículos relacionados del
  mismo idioma.
- Si el artículo trata preparación física, fuerza o readaptación, enlaza
  contextualizadamente hacia `https://tuentrenador.me/blog-tu-entrenador/`
  con `target="_blank" rel="noopener"`.
- **Localidades footer:** incluir siempre Valencia capital, Paterna, La Eliana,
  San Antonio de Benagéber, Bétera, Mas Camarena, Burjassot, Godella y Rocafort.

## 4. Flujo de trabajo exigido (no lo omitas)

1. **Fase 1 (propuesta):** nombres exactos de los archivos `.html` (ES/EN), el
   nombre de la imagen `.avif` de portada, la estructura (H1, H2, H3) y 3 FAQs
   estratégicas. **Espera el OK del usuario.**
2. **Fase 2 (código):** tras el OK, genera el código HTML íntegro de AMBOS
   idiomas siguiendo la plantilla oficial (CSS compilado crítico, SVGs inline,
   FAQs con `<details>`), y recuerda ejecutar al final
   `python scripts/actualizar_blog.py`.
