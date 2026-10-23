# Roadmap de trabajo — clasespadelvalencia.com

Notas de trabajo a futuro (mejoras y aprendizajes pendientes de aplicar). Fecha de apertura: **23/10/2026**.

---

## 1. Campaña de pago en Instagram (Paid Social) — a reajustar

**Qué pasó.** Se lanzó una campaña de pago desde un anuncio de Instagram dirigida a la web. Los datos de GA4 lo confirman:

| Canal | Sesiones | Tasa de interacción |
|---|---|---|
| Paid Social | 262 (54% del total) | **3,05%** |

Es el **canal con más sesiones y, a la vez, el de menor calidad**: solo 3 de cada 100 sesiones generaron interacción real (frente al 31% de Directo, 42% de Social orgánico, 74% de Búsqueda orgánica y 81% de Referral). Conclusión: **la campaña trajo volumen, pero no tráfico cualificado. No funcionó.**

**Hipótesis del fallo** (a validar antes de repetir):
- Público demasiado amplio o poco alineado con la intención real (alguien dispuesto a pagar clases presenciales en Valencia).
- Falta de coherencia entre el creativo del anuncio y la página de destino (el anuncio promete una cosa y la landing genérica no la confirma).
- Sin oferta clara de conversión (llamada a la acción concreta, prueba social, primer paso sencillo).

**Plan para próximas campañas:**
- Segmentar por **intención local** (Valencia/Paterna + intereses de pádel + personas que ya siguen cuentas de pádel), no por públicos amplios.
- **Página de destino específica** para el anuncio (oferta concreta: diagnóstico técnico 40 €, plaza de prueba, etc.), no enviar al home genérico.
- Presupuesto de **test corto y cerrado** antes de escalar; medir `clic_whatsapp` como métrica de éxito, no clics ni sesiones.
- Revisar atribución/UTMs para separar bien Paid Social de Directo y evitar confusiones de canal.

---

## 2. Quick wins SEO (del informe técnico)

- [ ] Acortar títulos que Google trunca (>60 caracteres): `indoor-vs-outdoor` (ES 75 / EN 80) y `best-padel-clubs` (63).
- [ ] Acortar meta descriptions largas (>158): `biomecanica-lesiones-codo` (165), `formatos-clases-padel-valencia` (166), `padel-elbow-injury-biomechanics` (163).
- [ ] Añadir datos estructurados en `sobre-mi`/`about-me` (schema `Person`) y `blog`/`blog-en` (`Blog`/`CollectionPage`).
- [ ] Corregir capitalización heredada: `Profesor-padel-titulado-valencia.avif` → kebab-case minúsculas.

## 3. Local SEO

- [ ] **Crear Google Business Profile** (todavía no existe). Es la palanca local nº 1: capta búsquedas "cerca de mí" y refuerza el negocio local. Cuando esté, añadir su URL a `sameAs` en el JSON-LD del negocio.

## 4. SEO de escritorio

- [ ] Revisar por qué el rendimiento en ordenador es peor que en móvil (posición media 49,5 vs 10,2). Priorizar el **home** como página con mayor margen de mejora.

---

## Pendiente de decisión

- Conectar la **API de GA4 + Search Console** (service account) para regenerar estos informes automáticamente con datos reales.
