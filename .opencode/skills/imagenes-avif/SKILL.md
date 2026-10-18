---
name: Imágenes AVIF
description: Use when adding, replacing, or optimizing images for clasespadelvalencia.com. Converts JPG/PNG/WebP to .avif with sharp via scripts/optimizar-imagenes.mjs, enforces the .avif-only rule, the kebab-case naming convention, resizing, and the correct <img>/preload/og:image markup. Also use when wiring a new article's cover image or updating og:image.
---

# Skill: Pipeline de imágenes (AVIF)

Todo el sitio usa **exclusivamente `.avif`**. Este skill cubre cómo generar e integrar imágenes.
Este modelo **no genera imágenes**: el autor aporta las fotos originales y esta skill las optimiza.

## 1. Requisito previo (una sola vez)

```bash
npm install        # instala sharp (dependencia de desarrollo)
```

`node_modules/` está en `.gitignore`; se versionan `package.json` y `package-lock.json`.

## 2. Convertir a AVIF

Deja los originales en `img-originales/` (ignorada por git) y ejecuta:

```bash
npm run optimizar:imagenes
```

Opciones útiles:

```bash
npm run optimizar:imagenes -- --width 800 foto.jpg     # un archivo, ancho 800px
npm run optimizar:imagenes -- --quality 45 --max-kb 100
npm run optimizar:imagenes -- --suffix -2x             # variante retina
```

- Ancho por defecto 1600 px (nunca amplía si la fuente es más pequeña).
- Calidad AVIF por defecto 55. Objetivo de peso: ≤ 150 KB (avisa si lo supera).
- Salida: la raíz del repo, que es donde el sitio referencia los `.avif`.
- El nombre de salida se deriva del original en **kebab-case** y minúsculas.

## 3. Convención de nombres y tamaños

- Nombre descriptivo en kebab-case ligado al tema/artículo: `precios-clases-padel-valencia.avif`.
- **Sin mayúsculas** (existe un caso heredado a corregir: `Profesor-padel-titulado-valencia.avif`).
- Evita duplicar imágenes: reutiliza las existentes siempre que encajen (`aprender-padel-valencia.avif`, etc.).

## 4. Integrar en el HTML

**Hero (LCP del artículo)** → preload + atributos de prioridad:

```html
<link rel="preload" as="image" href="slug-articulo.avif" fetchpriority="high">
...
<img src="slug-articulo.avif" width="1600" height="900" fetchpriority="high"
     alt="descripción real y localizada" class="...">
```

**Imágenes secundarias** → carga diferida y dimensiones para evitar CLS:

```html
<img src="slug.avif" loading="lazy" decoding="async" width="320" height="192"
     alt="descripción real y localizada" class="...">
```

Reglas:
- **Siempre** `width`/`height` (proporción real de la imagen) y un `alt` descriptivo en el idioma de la página.
- Las versiones ES/EN deben usar el `alt` traducido.

## 5. Actualizar el `og:image`

Si la imagen es la portada social del artículo, actualiza:

```html
<meta property="og:image" content="https://clasespadelvalencia.com/slug-articulo.avif">
```

## 6. Cierre

Tras integrar, verifica que no queden referencias a formatos antiguos (`.jpg`, `.png`, `.webp`) en las
páginas del artículo y que `og:image` apunte al `.avif` correcto.
