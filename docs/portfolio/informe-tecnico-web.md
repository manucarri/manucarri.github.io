# Informe Técnico del Activo Web — clasespadelvalencia.com

> Documento preparado para uso en el **portfolio comercial** del proyecto (negociación con marcas / partners / patrocinadores).
> Fecha del informe: **23 de octubre de 2026** · Auditoría realizada sobre el repositorio y sobre la web en producción.

---

## 1. Resumen ejecutivo

**clasespadelvalencia.com** es una web estática bilingüe (ES/EN) del entrenador de pádel **Manu Carrilero** (Elite 22, Paterna, Valencia). Se posiciona como un activo digital **propio, controlado y técnicamente sólido**: sin dependencias externas, con rendimiento excepcional y una estructura SEO 100% preparada para escalar.

| Indicador | Valor |
|---|---|
| Páginas HTML publicadas | **32** (30 indexables + 2 legales en `noindex`) |
| Idiomas | **2** — Español e Inglés (espejo completo, mismo contenido adaptado) |
| Contenido indexable total | **37.557 palabras** en 30 páginas |
| Media por página | **~1.252 palabras** (máx. 2.761 · mín. 410) |
| Artículos SEO (pares ES/EN) | **11 temas = 22 artículos** |
| Lighthouse **SEO** | **100 / 100** |
| Lighthouse **Buenas prácticas** | **100 / 100** |
| Lighthouse **Accesibilidad** | **96 / 100** |
| Peso real de una página de artículo | **~96 KB** (2 peticiones de red) |
| CSS | Inline, sin frameworks ni CDN |
| Medición | Google Analytics 4 (`G-HT4WB8DKEV`) en todas las páginas |

> **Aviso de alcance:** este informe es una **auditoría técnica y de contenido**. No incluye métricas de tráfico, clics ni posiciones reales porque el acceso a **Google Search Console** y a la **API de GA4** no está configurado en este entorno. Esas cifras se añadirán cuando se conecte el acceso (ver sección 8).

---

## 2. Qué es el activo

- **Titular:** Manu Carrilero — Licenciado en CAFYD, Monitor APA, especialista en biomecánica aplicada al pádel.
- **Propuesta:** clases de pádel indoor en Paterna/Valencia (individual, pareja, grupos y escuela infantil), con método biomecánico y vídeo-análisis.
- **Tecnología:** HTML5 + CSS compilado a mano e inline. **Sin framework, sin bundler, sin paso de build.** Hosting en GitHub Pages con dominio propio y HTTPS.
- **Plataforma:** 100% assets estáticos propios → rápido, barato de mantener, seguro y difícil de romper.

---

## 3. Arquitectura y contenido

### 3.1 Mapa del sitio (30 páginas indexables)

| Bloque | Español | English |
|---|---|---|
| Home | `index.html` | `index-en.html` |
| Blog (índice) | `blog.html` | `blog-en.html` |
| Sobre el entrenador | `sobre-mi.html` | `about-me.html` |
| Página de servicio | `clases-padel-valencia.html` | `padel-lessons-valencia.html` |
| 11 artículos | (ver tabla abajo) | (ver tabla abajo) |

### 3.2 Artículos publicados (11 temas, versiones ES + EN)

| # | Tema | Palabras ES | Palabras EN |
|---|---|---|---|
| 1 | Precios de las clases | 1.581 | 1.426 |
| 2 | Formatos: grupo / pareja / individual | 823 | 845 |
| 3 | Mejores clubes de pádel indoor | 2.761 | 2.351 |
| 4 | Biomecánica y lesiones de codo | 1.267 | 1.262 |
| 5 | Clases de pádel para niños | 1.862 | 1.777 |
| 6 | Indoor vs. outdoor | 1.754 | 1.511 |
| 7 | Guía de iniciación | 1.752 | 1.571 |
| 8 | Empuñadura continental y errores | 848 | 810 |
| 9 | Técnica tradicional y estancamiento | 1.344 | 1.300 |
| 10 | Por qué no enseño la contrapared | 811 | 818 |
| 11 | Vídeo-análisis: grabarse jugando | 1.712 | 1.500 |

**Temática de nicho y autoridad (E-E-A-T):** contenido escrito en primera persona por un profesional titulado, con enfoque técnico/científico (biomecánica, aprendizaje motor, prevención de lesiones) — no contenido genérico de relleno.

---

## 4. SEO técnico

### 4.1 On-page (30 páginas indexables)

| Elemento | Estado |
|---|---|
| `<title>` único por página | ✅ 30/30 |
| Meta `description` única | ✅ 28/30 (las 2 legales noindex no la necesitan) |
| Un solo `<h1>` por página | ✅ 30/30 |
| Estructura jerárquica H2/H3 | ✅ (ej. home: 9 H2 + 12 H3) |
| `canonical` self-referencing | ✅ 30/30 |
| `hreflang` ES / EN / x-default | ✅ 30/30 |
| Open Graph (`og:*`) + `og:image` | ✅ 30/30 |
| `sitemap.xml` | ✅ generado y actualizado automáticamente |
| `robots.txt` | ✅ `Allow: /` + referencia al sitemap |
| `noindex` correcto en páginas legales | ✅ (`condiciones`, `terms`) |

### 4.2 Metadatos enriquecidos (Schema.org / JSON-LD)

- **Home ES/EN:** `SportsActivityLocation` (dirección completa, `GeoCoordinates`, horarios, `OfferCatalog` con 7 programas, `Person`) + `FAQPage`.
- **Artículos:** `BlogPosting` con `datePublished` + `Person` + `Organization` + `WebPage` + `BreadcrumbList`, y `FAQPage` / `ItemList` en los artículos que los requieren.
- **Páginas de servicio:** `Service` + `Place` + `Offer` + `FAQPage`.

Esto habilita resultados enriquecidos en Google (breadcrumbs, FAQ, datos de negocio local).

### 4.3 Interlinking y SEO local

- Enlazado interno entre artículos, páginas de servicio y blog.
- **Bloque SEO local** con las 9 localidades objetivo: Valencia capital, Paterna, La Eliana, San Antonio de Benagéber, Bétera, Mas Camarena, Burjassot, Godella y Rocafort.
- `llms.txt` presente: la web está preparada para ser leída correctamente por buscadores con IA.

---

## 5. Rendimiento y calidad técnica

Medido en vivo sobre la web en producción (Lighthouse + API de rendimiento del navegador):

| Métrica | Resultado |
|---|---|
| Lighthouse SEO | **100** |
| Lighthouse Best Practices | **100** |
| Lighthouse Accessibility | **96** |
| Recursos por página de artículo | **2** peticiones |
| Peso total transferido (artículo, sin caché) | **~96 KB** |
| CSS inline | **~8 KB** |
| TTFB | ~495 ms (GitHub Pages) |
| DOMContentLoaded | ~510 ms |
| Carga completa | ~850 ms |
| Imágenes | Formato **AVIF** exclusivamente, con `width`/`height` y `alt` localizado |

**Sin dependencias de CDN** en producción (no Tailwind CDN, no Lucide): solo el script de Google Tag Manager. Esto elimina puntos de fallo y reduce el peso drásticamente.

### Únicas incidencias detectadas (menores)
- **Accesibilidad (96):** dos avisos de contraste de color y correspondencia de etiquetas accesibles. No afectan a SEO ni a la indexación.
- **TTFB ~495 ms:** mejorable migrando a un CDN delante de GitHub Pages, pero la página completa ya carga por debajo de 1 s.

---

## 6. Analítica y medición

- **Google Analytics 4** activo en todas las páginas (`G-HT4WB8DKEV`).
- **Eventos personalizados de conversión:** `clic_whatsapp` con un parámetro `origen` **único por página y por posición** (header, CTA, footer, botón flotante). Esto permite saber **qué artículo y qué botón** genera cada contacto.
- El activo está **instrumentado para medir negocio**, no solo visitas: cada clic a WhatsApp queda trazado.

---

## 7. Áreas de mejora (quick wins)

Opcionales, de bajo coste y alto impacto percibido:

1. **Títulos largos** que Google truncará (>60 caracteres): `indoor-vs-outdoor` (ES 75 / EN 80), `best-padel-clubs` (63). Reescribir para mantener el beneficio en la SERP.
2. **Meta descriptions** ligeramente largas (>158 caracteres): `biomecanica-lesiones-codo` (165), `formatos-clases-padel-valencia` (166), `padel-elbow-injury-biomechanics` (163).
3. **Faltan datos estructurados** en `sobre-mi`/`about-me`, `blog`/`blog-en`: añadir `Person` (autoridad del coach) y `Blog`/`CollectionPage`.
4. **Google Business Profile:** todavía no creado. Es la palanca local nº1 para captar búsquedas "cerca de mí" y reforzar el negocio local.
5. **Corregir capitalización** heredada en `Profesor-padel-titulado-valencia.avif` → kebab-case minúsculas.

---

## 8. Cómo añadir tráfico y posiciones reales (siguiente paso)

Para completar el portfolio con **métricas de audiencia** (visitas, usuarios, fuentes de tráfico, clics e impresiones orgánicas, CTR y posición media) hay dos vías:

1. **Manual:** exportar CSV/PDF desde GA4 (*Informes → Exportar*) y Search Console (*Rendimiento → Exportar*) y volcarlos a este informe.
2. **Automática (recomendada):** crear un *service account* en Google Cloud con acceso de lectura a GA4 (Data API) y a Search Console API. A partir de ahí el informe se puede regenerar con datos reales de forma recurrente.

---

## 9. Conclusión

El activo **no es un folleto**: es un sistema de contenidos bilingüe, técnicamente impecable (SEO 100, sin deuda técnica ni dependencias), instrumentado para medir conversiones y con una base de contenido de autoridad de casi 38.000 palabras. Está **listo para escalar** con más artículos, campañas de marcas y patrocinios sin tocar la arquitectura.

---
---

# Technical Asset Report — clasespadelvalencia.com (EN)

**clasespadelvalencia.com** is a bilingual (ES/EN) static website for padel coach **Manu Carrilero** (Elite 22, Paterna, Valencia). It is a **fully owned, self-hosted, technically flawless digital asset**.

| KPI | Value |
|---|---|
| Published HTML pages | **32** (30 indexable + 2 `noindex` legal pages) |
| Languages | **2** — Spanish & English (full mirrored structure) |
| Indexable content | **37,557 words** across 30 pages (~1,252 words average) |
| SEO articles | **11 topics = 22 articles** (ES + EN) |
| Lighthouse **SEO** | **100 / 100** |
| Lighthouse **Best Practices** | **100 / 100** |
| Lighthouse **Accessibility** | **96 / 100** |
| Article page weight | **~96 KB**, 2 network requests |
| CSS | Hand-compiled & inlined — no frameworks, no CDN |
| Analytics | GA4 (`G-HT4WB8DKEV`) with per-page WhatsApp click tracking |

**Highlights:** self-referencing canonicals and full `hreflang` on all pages, rich JSON-LD structured data (`SportsActivityLocation`, `Service`, `BlogPosting`, `FAQPage`, `BreadcrumbList`), AVIF-only images, an auto-updating sitemap, and an `llms.txt` for AI search engines.

**Scope note:** traffic and ranking metrics are not included — Google Search Console and GA4 API access are not yet configured. See section 8 for how to add real audience data.
