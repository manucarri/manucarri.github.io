# Manual de Instrucciones y Directrices Técnicas
### Proyecto: clasespadelvalencia.com (manucarri.github.io)

> Este documento es la referencia obligatoria para cualquier agente de IA (o
> desarrollador humano) que edite páginas HTML de este repositorio. Resume el
> estándar de **WPO (Web Performance Optimization)**, **SEO**, y consistencia
> visual/funcional que deben cumplir TODOS los archivos `.html` del sitio.
>
> Última actualización: homogeneización completa de los 25 archivos HTML
> (octubre 2026). Si vas a crear o tocar una página, usa como plantilla de
> referencia cualquiera de estos archivos ya homogeneizados:
> `cuanto-cuestan-clases-padel-valencia-precios.html`,
> `biomecanica-lesiones-codo-padel.html`, `best-padel-clubs-valencia.html`,
> `blog.html`, `formatos-clases-padel-valencia.html`.

---

## 1. Regla de oro: CERO dependencias CDN en producción

Está **prohibido** dejar en el HTML final:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest" defer></script>
<script>
    tailwind.config = { theme: { extend: { colors: { padel: {...} } } } }
</script>
```

Motivo: estos scripts bloquean el renderizado, añaden peticiones de red
externas y penalizan Core Web Vitals (LCP/CLS). Todo el CSS de Tailwind usado
en la página debe compilarse **a mano** e incrustarse inline en un bloque
`<style>` dentro del `<head>` (ver sección 2). Todos los iconos deben ser
`<svg>` inline (ver sección 3).

El único `<script>` permitido relacionado con terceros es Google Tag Manager
(`gtag.js`), que se deja tal cual está en todas las páginas.

---

## 2. CSS Crítico Compilado (inline, sin bloqueo de render)

Sustituye el bloque de scripts CDN por esto, justo en el mismo lugar del
`<head>`:

```html
<!-- CSS Crítico Compilado (0ms bloqueo de renderizado) -->
<style>
    *,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
    html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;scroll-behavior:smooth}
    body{margin:0;line-height:inherit}
    h1,h2,h3,p,ul,ol,table,blockquote{margin:0;padding:0}
    ul{list-style:none}
    a{color:inherit;text-decoration:inherit}
    img,svg{display:block;vertical-align:middle}
    img{max-width:100%;height:auto}
    summary::-webkit-details-marker{display:none} /* si hay <details>/<summary> para FAQs */
    table{border-collapse:collapse;width:100%}     /* si hay tablas */

    /* Layout & Positioning */
    .fixed{position:fixed}.sticky{position:sticky}.top-0{top:0}.bottom-5{bottom:1.25rem}.right-5{right:1.25rem}.z-50{z-index:50}
    /* ... resto de utilidades realmente usadas en ESA página (margin, padding, flex, grid, etc.) */

    /* Typography & Colors */
    .text-padel-600{color:#16a34a}.text-padel-900{color:#14532d} /* paleta "padel" de Tailwind config antigua */
    /* ... */

    @media (min-width: 640px) { /* sm: */ }
    @media (min-width: 768px) { /* md: */ }
    @media (min-width: 1024px){ /* lg: */ }
</style>
```

### Reglas al compilar el CSS crítico:
1. **No copies un CSS genérico completo**: incluye únicamente las clases
   Tailwind que realmente aparecen en ese archivo HTML (abre el archivo y
   revisa cada `class="..."` usado). Esto mantiene el bloque ligero.
2. Usa la paleta de colores custom `padel` que define el antiguo
   `tailwind.config`:
   `padel-50:#f0fdf4`, `padel-100:#dcfce7`, `padel-500:#22c55e`,
   `padel-600:#16a34a`, `padel-900:#14532d`, `padel-accent:#f59e0b`.
3. Los selectores con `:` (pseudo-clases/responsive) se escriben escapando
   el carácter en CSS: `.hover\:bg-padel-600:hover{...}`,
   `.md\:flex{...}` dentro de su `@media`.
4. Si la página usa acordeones FAQ con `<details>/<summary>` nativos, añade
   siempre:
   ```css
   summary::-webkit-details-marker{display:none}
   .cursor-pointer{cursor:pointer}.list-none{list-style-type:none}
   details[open] .group-open\:rotate-180{transform:rotate(180deg)}
   .transition{transition:transform .15s ease}
   ```
5. Verifica que el `<body>` ya no lleve la clase `font-sans` (innecesaria,
   la fuente va en el `html{font-family:...}` del CSS crítico). Ejemplo:
   `<body class="bg-gray-50 text-gray-800 antialiased flex flex-col min-h-screen">`.

---

## 3. Iconos: SIEMPRE `<svg>` inline, nunca `<i data-lucide="...">`

Cada `<i data-lucide="nombre-icono" class="h-5 w-5 ...">...</i>` se sustituye
por su SVG equivalente de [Lucide](https://lucide.dev), con estos atributos
fijos:

```html
<svg class="<mismas-clases-que-tenía-el-i>" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true">
    <!-- paths del icono -->
</svg>
```

Tabla de iconos ya usados en el sitio (reutilízalos tal cual, no los
regeneres desde cero):

| Icono Lucide | SVG inner (paths) |
|---|---|
| `tennis` | `<circle cx="12" cy="12" r="10"/><path d="M8.5 8.5c2.5-2.5 6.5-2.5 9 0"/><path d="M6.5 15.5c2.5 2.5 6.5 2.5 9 0"/>` |
| `message-circle` | `<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>` |
| `menu` | `<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>` |
| `arrow-left` | `<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>` |
| `arrow-right` | `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>` |
| `instagram` | `<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>` |
| `linkedin` | `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>` |
| `map-pin` | `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>` |
| `phone` | `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>` |
| `check-circle-2` | `<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>` |
| `chevron-down` | `<path d="m6 9 6 6 6-6"/>` |
| `play-circle` | `<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>` |
| `info` | `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>` |
| `alert-triangle` | `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>` |

Si necesitas un icono que no está en la tabla, búscalo en lucide.dev, copia
sus `<path>`/`<circle>`/etc. y añádelo a esta tabla para futuras referencias.

Al terminar de reemplazar iconos, **elimina siempre** el script de
inicialización que ya no hace falta:
```html
<script>
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }
        ...
    });
</script>
```
Deja solo la lógica de menú móvil (`btnMenu`/`menuMovil`) si existe, sin la
llamada a `lucide.createIcons()`.

---

## 4. Estructura del `<header>` y navegación

- El logo siempre usa el SVG `tennis` de 32x32 (`h-8 w-8`).
- El enlace "Volver al blog" / "Back to blog" usa el SVG `arrow-left`.
- El botón de menú móvil (`id="btn-menu"`) usa el SVG `menu` y debe llevar
  `aria-label="Abrir menú"` (ES) / `aria-label="Open menu"` (EN).
- Envuelve los enlaces de navegación secundaria (versión en otro idioma +
  volver al blog) en un `<nav aria-label="Navegación del artículo">` (ES) /
  `<nav aria-label="Article navigation">` (EN) en vez de un `<div>` simple,
  por accesibilidad y SEO semántico.
- El emoji de bandera (`🇬🇧` / `🇪🇸`) dentro de un `<span>` debe llevar
  `aria-hidden="true"` porque es puramente decorativo.

---

## 5. Footer: `<h2>` en vez de `<h4>`, y bloque de localidades SEO

### 5.1 Encabezados
Las dos columnas del footer ("Ubicación de Entrenamiento"/"Training
Location" y "Contacto Directo"/"Direct Contact") deben usar `<h2>`, **no**
`<h4>`. El footer es contenido final de página y Google valora mejor una
jerarquía de encabezados limpia (un solo `<h1>` en el artículo + `<h2>` para
secciones relevantes, incluido el footer).

> Nota: los `<h4>` que aparecen DENTRO del cuerpo del artículo (cajas
> destacadas tipo "Profundiza en tu técnica") NO se tocan — esa regla solo
> aplica al `<footer>`.

### 5.2 Bloque de localidades SEO local (texto exacto a reutilizar)

**Español:**
```html
<div class="mt-5 pt-5 border-t border-gray-800">
    <p class="text-xs leading-relaxed text-gray-400">
        Clases impartidas en <strong>Elite 22 (Paterna)</strong>. Club de fácil acceso y aparcamiento gratuito, a menos de 10 minutos para jugadores de <strong>Valencia capital, Paterna, La Eliana, San Antonio de Benagéber, Bétera, Mas Camarena, Burjassot, Godella y Rocafort</strong>.
    </p>
</div>
```

**Inglés:**
```html
<div class="mt-5 pt-5 border-t border-gray-800">
    <p class="text-xs leading-relaxed text-gray-400">
        Lessons held at <strong>Elite 22 (Paterna)</strong>. Easily accessible club with free parking, less than 10 minutes away for players from <strong>Valencia city, Paterna, La Eliana, San Antonio de Benagéber, Bétera, Mas Camarena, Burjassot, Godella, and Rocafort</strong>.
    </p>
</div>
```

Importante:
- La clase de color pasa de `text-gray-500` (antigua) a **`text-gray-400`**
  (más legible sobre `bg-gray-950`).
- No dejes los comentarios `<!-- NUEVO BLOQUE SEO LOCAL -->` /
  `<!-- FIN DEL BLOQUE SEO LOCAL -->` — ya no aportan nada, el bloque es el
  estándar actual.
- La lista de localidades es siempre esta (9 localidades, en este orden).
  No la acortes ni la cambies de artículo a artículo.

---

## 6. Botón flotante de WhatsApp (obligatorio en TODAS las páginas de artículo)

Debe aparecer justo después de cerrar el `</footer>` y antes del `<script>`
final (o antes de `</body>` si no hay script de menú):

**Español:**
```html
<!-- BOTÓN FLOTANTE DE WHATSAPP -->
<a href="https://wa.me/34622041911?text=Hola%20Manu,%20estoy%20leyendo%20tu%20artículo%20sobre%20<TEMA>%20y%20me%20gustaría%20consultar%20disponibilidad%20para%20clases"
   onclick="gtag('event', 'clic_whatsapp', {'origen': 'boton_flotante_articulo_<slug>'});"
   target="_blank"
   aria-label="Contactar por WhatsApp"
   class="fixed bottom-5 right-5 z-50 bg-green-600 hover:bg-green-500 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 font-bold transition-all hover:scale-105 border-2 border-white">
    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
    <span class="text-sm sm:text-base">¿Entrenamos?</span>
</a>
```

**Inglés:** mismo patrón, cambiando el texto del `href` (URL-encoded en
inglés), el `origen` del evento a `boton_flotante_articulo_<slug>_en`, el
`aria-label="Contact via WhatsApp"` y el texto visible a `Shall we train?`.

Notas:
- El icono es el mismo `message-circle`, pero aquí con **`fill="currentColor"`**
  (relleno sólido), a diferencia del resto de iconos de la página que llevan
  `fill="none"`.
- El evento `gtag('event', 'clic_whatsapp', {'origen': '...'})` debe tener un
  `origen` único por página/posición (`footer_articulo_<slug>`,
  `boton_flotante_articulo_<slug>`, `cta_articulo_<slug>`, etc.) para poder
  diferenciar el tracking en Google Analytics.
- El teléfono siempre es `34622041911`.

---

## 7. Crossover con TuEntrenador.me

Los artículos relacionados con biomecánica, lesiones, preparación física o
pérdida de rendimiento deben incluir una caja destacada de crossover hacia
**tuentrenador.me** (ver ejemplos en `biomecanica-lesiones-codo-padel.html`,
`cuanto-cuestan-clases-padel-valencia-precios.html`,
`video-analisis-grabarse-jugando-padel.html`):

```html
<!-- CAJA DESTACADA CROSSOVER -> TUENTRENADOR.ME -->
...
<a href="https://tuentrenador.me/blog-tu-entrenador/" target="_blank" rel="noopener" ...>
```

Usa siempre `target="_blank" rel="noopener"` en estos enlaces externos. No
es obligatorio en todos los artículos, solo donde el contenido lo justifique
(lesiones, fuerza, prevención, readaptación física).

---

## 8. SEO general (no tocar sin necesidad, pero verificar que exista)

Cada página de artículo debe mantener en el `<head>`:
- `<link rel="canonical" href="https://clasespadelvalencia.com/<archivo>.html" />`
- `<link rel="alternate" hreflang="es|en|x-default" href="..." />` (si tiene
  versión bilingüe espejo).
- `<meta property="og:title|og:description|og:image|og:url|og:type">`.
- Script `application/ld+json` con `BlogPosting` + `FAQPage` (si el artículo
  tiene preguntas frecuentes) usando `@context: https://schema.org`.
- Preload de la imagen LCP si la hay:
  `<link rel="preload" as="image" href="..." fetchpriority="high">`.

No elimines ni reescribas estos bloques al homogeneizar estilos — solo
toca `<script>`/`<style>`/iconos/footer según este manual.

---

## 9. Checklist rápido antes de dar por cerrada una página

- [ ] Sin `<script src="https://cdn.tailwindcss.com">` ni `unpkg.com/lucide`.
- [ ] `<style>` crítico inline con solo las clases usadas en esa página.
- [ ] Cero `<i data-lucide="...">` restantes (verificar con
      `Select-String -Pattern 'data-lucide'`).
- [ ] Footer con `<h2>` (no `<h4>`) en sus dos columnas.
- [ ] Bloque de localidades SEO actualizado (9 localidades, `text-gray-400`).
- [ ] Botón flotante de WhatsApp presente con `origen` de tracking único.
- [ ] Script final sin `lucide.createIcons()`.
- [ ] El archivo sigue terminando en `</html>` y el HTML es válido (abre/
      cierra `<style>`, `<footer>`, etc. en pares).

---

## 10. Scripts de automatización del repositorio

- `scripts/actualizar_blog.py`: genera automáticamente las tarjetas del
  blog (`blog.html`/`blog-en.html`), actualiza la home con el último
  artículo y regenera `sitemap.xml`. Se ejecuta con
  `python scripts/actualizar_blog.py` tras publicar un artículo nuevo.
- **No crear scripts Python "temporales" para editar HTML en bloque** salvo
  que se vayan a probar exhaustivamente antes de ejecutarlos (el incidente
  que motivó este manual fue un script `_homogeneizar.py` que quedó con
  errores de sintaxis a medio terminar). Si se necesita un script de
  migración masiva, verificar sintaxis con
  `python -c "import ast; ast.parse(open('script.py', encoding='utf-8').read())"`
  antes de ejecutarlo, y borrarlo al terminar la tarea.
