#!/usr/bin/env node
/**
 * Optimizador de imagenes para clasespadelvalencia.com
 * Convierte JPG/PNG/WebP a .avif (formato unico del sitio), redimensiona y reporta el peso.
 *
 * Uso:
 *   npm run optimizar:imagenes                       -> procesa todo img-originales/
 *   npm run optimizar:imagenes -- foto.jpg           -> procesa un archivo concreto
 *   npm run optimizar:imagenes -- --width 800 foto.jpg
 *
 * Opciones:
 *   --width <px>       Ancho maximo (por defecto 1600). Nunca amplia si la fuente es mas pequena.
 *   --quality <1-100>  Calidad AVIF (por defecto 55).
 *   --effort <0-9>     Esfuerzo de compresion AVIF, mas alto = mas lento y mas pequeno (por defecto 4).
 *   --out <dir>        Carpeta destino (por defecto la raiz del repo).
 *   --suffix <txt>     Sufijo de nombre para retina, p. ej. "-2x" (por defecto vacio).
 *   --max-kb <n>       Avisa si el .avif resultante supera este peso (por defecto 150).
 *   --bg <color>       Color de fondo si la fuente tiene transparencia (por defecto "#ffffff").
 *   --help
 *
 * Los originales se leen de img-originales/ (ignorado por git). La salida va a la raiz
 * del repo, que es donde el sitio referencia los .avif.
 */

import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "img-originales");
const SOURCE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif"]);

function parseArgs(argv) {
  const opts = {
    width: 1600,
    quality: 55,
    effort: 4,
    out: ROOT,
    suffix: "",
    maxKb: 150,
    bg: "#ffffff",
    files: [],
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--width": opts.width = Number(next()); break;
      case "--quality": opts.quality = Number(next()); break;
      case "--effort": opts.effort = Number(next()); break;
      case "--out": opts.out = path.resolve(ROOT, next()); break;
      case "--suffix": opts.suffix = next(); break;
      case "--max-kb": opts.maxKb = Number(next()); break;
      case "--bg": opts.bg = next(); break;
      case "--help":
      case "-h":
        console.log(
          "Uso: node scripts/optimizar-imagenes.mjs [archivos...] " +
          "[--width 1600] [--quality 55] [--effort 4] [--out <dir>] [--suffix -2x] [--max-kb 150] [--bg #fff]"
        );
        process.exit(0);
        break;
      default:
        if (a.startsWith("--")) throw new Error(`Opcion desconocida: ${a}`);
        opts.files.push(a);
    }
  }
  return opts;
}

/** Convierte un nombre de archivo en slug kebab-case sin acentos ni mayusculas. */
function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function human(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function collectInputs(opts) {
  if (opts.files.length > 0) {
    return opts.files.map((f) => path.resolve(ROOT, f));
  }
  try {
    const entries = await readdir(SRC_DIR, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && SOURCE_EXTS.has(path.extname(e.name).toLowerCase()))
      .map((e) => path.join(SRC_DIR, e.name));
    if (files.length === 0) {
      throw new Error("La carpeta img-originales/ esta vacia.");
    }
    return files;
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(
        `No existe ${path.relative(ROOT, SRC_DIR)}/. Crea la carpeta y deja ahi las fotos, ` +
          `o pasa archivos explicitos: npm run optimizar:imagenes -- foto.jpg`
      );
    }
    throw err;
  }
}

async function optimize(file, opts) {
  const ext = path.extname(file).toLowerCase();
  if (!SOURCE_EXTS.has(ext)) return null;

  const base = slugify(path.basename(file, ext));
  const outName = `${base}${opts.suffix}.avif`;
  const outPath = path.join(opts.out, outName);

  const input = sharp(file, { failOn: "none" });
  const meta = await input.metadata();

  // Redimensiona solo si la fuente es mas ancha que el objetivo (nunca amplia).
  const pipeline = [];
  if (meta.width && meta.width > opts.width) {
    pipeline.push(sharp(file).resize({ width: opts.width, withoutEnlargement: true }));
  } else {
    pipeline.push(sharp(file));
  }

  const buffer = await pipeline[0]
    .flatten({ background: opts.bg }) // evita bordes negros si hay transparencia
    .avif({ quality: opts.quality, effort: opts.effort })
    .toBuffer();

  await writeFile(outPath, buffer);

  const rel = path.relative(ROOT, outPath).replace(/\\/g, "/");
  const srcKb = (await stat(file)).size / 1024;
  const outKb = buffer.length / 1024;
  const saved = srcKb > 0 ? Math.round((1 - outKb / srcKb) * 100) : 0;
  const warn = outKb > opts.maxKb ? "  <-- SUPERA EL OBJETIVO, baja --quality" : "";

  console.log(
    `${rel}  ${meta.width ? meta.width + "px -> " : ""}${opts.width}px  ` +
      `${human(srcKb * 1024)} -> ${human(outKb * 1024)} (-${saved}%)${warn}`
  );

  return { outName, outPath, width: opts.width, height: Math.round((opts.width * (meta.height || 1)) / (meta.width || 1)) };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  await mkdir(opts.out, { recursive: true });
  const files = await collectInputs(opts);

  console.log(`Optimizando ${files.length} imagen(es) a AVIF (ancho ${opts.width}px, calidad ${opts.quality})...\n`);
  const results = [];
  for (const f of files) {
    try {
      const r = await optimize(f, opts);
      if (r) results.push(r);
    } catch (err) {
      console.error(`ERROR con ${path.relative(ROOT, f)}: ${err.message}`);
      process.exitCode = 1;
    }
  }

  console.log(`\nListo: ${results.length} archivo(s) .avif generados en ${path.relative(ROOT, opts.out) || "."}/`);
  console.log("Siguiente paso: insertar la etiqueta <img> con width/height/alt y actualizar og:image si es la portada.");
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  process.exit(1);
});
