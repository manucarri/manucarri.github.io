# 01 — Arquitectura y Mantenimiento Técnico

> Documento de referencia (origen: cuaderno de trabajo del autor).
> El estado **actual** del proyecto y las reglas vigentes están en `AGENTS.md` (raíz).
> Reglas detalladas de markup: `MANUAL_DIRECTRICES_TECNICAS.md`.

**Proyecto:** clasespadelvalencia.com (GitHub Pages + HTML5 estático)

## 1. Protocolo obligatorio de inicio (Git)

Debido a la automatización del repositorio (el robot compila cambios
automáticos en la nube), **ANTES de iniciar cualquier sesión de trabajo local o
con agentes IA (VS Code / Cline / OpenCode)**, es estrictamente obligatorio
sincronizar el historial para evitar rechazos `non-fast-forward`:

```bash
git pull --rebase origin main
```

## 2. Directrices WPO (rendimiento extremo) y código

El repositorio está 100% homogeneizado. Está **TERMINANTEMENTE PROHIBIDO**
retroceder en las optimizaciones:

- **Cero dependencias externas:** prohibido inyectar `cdn.tailwindcss.com` o
  scripts de iconos (`unpkg.com/lucide`).
- **Estilos e iconos:** todo el CSS debe ir compilado e incrustado (inline) en
  el `<head>`. Todos los iconos deben ser elementos nativos
  `<svg aria-hidden="true">` incrustados en el HTML.
- **Imágenes (LCP):** uso exclusivo de formato `.avif`. La imagen principal
  (Hero) debe llevar `fetchpriority="high"`. Las secundarias,
  `loading="lazy" decoding="async"`.
- **Accesibilidad y semántica:** cierre estricto de `</main>` antes del
  `<footer>`. En el footer, los encabezados de columna deben ser `<h2>`
  (nunca `<h4>`). Las FAQs siempre con `<details>` y `<summary>` nativos.

## 3. Sistema de automatización (GitHub Actions)

El script `scripts/actualizar_blog.py` actualiza los índices automáticamente.

**PROHIBIDO BORRAR O ALTERAR ESTAS MARCAS HTML EN EL CÓDIGO:**

- En `blog.html` y `blog-en.html`: `<!-- BLOG-LIST-START -->` y `<!-- BLOG-LIST-END -->`
- En `index.html` e `index-en.html`: `<!-- HOME-LATEST-START -->` y `<!-- HOME-LATEST-END -->`

## 4. Analítica GA4 (G-HT4WB8DKEV)

Toda página debe incluir el script base y el rastreo de eventos en los botones
de WhatsApp (+34622041911) usando:

```html
onclick="gtag('event', 'clic_whatsapp', {'origen': '[ID_UNICO]'});"
```

El `origen` debe ser único por página y posición para diferenciar el tracking
en Google Analytics.
