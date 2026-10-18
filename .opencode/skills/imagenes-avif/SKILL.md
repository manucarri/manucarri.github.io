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

**Presets por uso** (recomendado, aplican ancho + proporción + calidad):

```bash
npm run optimizar:imagenes -- --use hero foto.jpg     # 1600px, 16:9 (imagen LCP)
npm run optimizar:imagenes -- --use card foto.jpg     #  800px, 5:3  (tarjetas)
npm run optimizar:imagenes -- --use thumb foto.jpg    #  160px, 1:1  (avatares)
```

**Recorte y ajuste fino:**

```bash
npm run optimizar:imagenes -- --ratio 16:9 --focus left foto.jpg
npm run optimizar:imagenes -- --focus attention foto.jpg        # auto-detección de la zona relevante
npm run optimizar:imagenes -- --crop 200,80,1200,900 foto.jpg   # x,y,w,h explícitos
npm run optimizar:imagenes -- --width 800 --quality 45 --max-kb 100 --suffix -2x foto.jpg
```

- Punto focal (`--focus`): `center|top|bottom|left|right|top-left|top-right|bottom-left|bottom-right|attention`.
- `--max-kb` (por defecto 150) **baja la calidad automáticamente** (pasos de 5, suelo 25) hasta cumplir el peso; si aún así no cabe, avisa.
- Ancho por defecto 1600 px (nunca amplía). Salida en la raíz del repo, nombre en kebab-case.
- El script **imprime las dimensiones finales** para usarlas como `width`/`height` del `<img>`.

Para el recorte "artístico", lo más fiable es indicar `--focus` (o usar `attention`); el agente no decide
el mejor encuadre estético por sí solo.

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
