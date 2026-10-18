---
description: Optimiza imágenes a AVIF e intégralas en el artículo
---

Optimiza imágenes para clasespadelvalencia.com.

Instrucciones:
1. Carga la skill `imagenes-avif`.
2. Si hay originales en `img-originales/`, ejecuta `npm run optimizar:imagenes`
   (ajusta `--width`/`--quality` según el uso: hero vs. tarjeta).
3. Integra el `<img>` correcto (width/height/alt; hero con preload +
   `fetchpriority="high"`; secundarias con `loading="lazy" decoding="async"`).
4. Actualiza `og:image` si es la portada del artículo.
5. Recuerda: las imágenes son `$ARGUMENTS` (si indico un archivo o uso concretos).
