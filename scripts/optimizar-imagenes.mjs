#!/usr/bin/env node
/**
 * Optimizador de imagenes para clasespadelvalencia.com
 * Convierte JPG/PNG/WebP a .avif (formato unico del sitio): recorta, redimensiona,
 * comprime hasta el peso objetivo y reporta las dimensiones finales para el <img>.
 *
 * Uso:
 *   npm run optimizar:imagenes                       -> procesa todo img-originales/
 *   npm run optimizar:imagenes -- foto.jpg           -> procesa un archivo concreto
 *   npm run optimizar:imagenes -- --use hero foto.jpg
 *   npm run optimizar:imagenes -- --ratio 16:9 --focus left foto.jpg
 *
 * Presets (--use):
 *   hero   -> 1600px, 16:9   (imagen LCP del articulo)
 *   card   ->  800px, 5:3    (tarjetas del blog/home)
 *   thumb  ->  160px, 1:1    (avatares / miniaturas)
 *
 * Opciones:
 *   --width <px>        Ancho maximo (por defecto 1600). Nunca amplia.
 *   --ratio <W:H>       Recorta a esta proporcion, p. ej. 16:9 o 1:1 (fit cover).
 *   --focus <pos>       Punto focal del recorte: center|top|bottom|left|right|
 *                       top-left|top-right|bottom-left|bottom-right|attention.
 *                       "attention" deja que sharp detecte la zona mas relevante.
 *   --crop <x,y,w,h>    Recorte explicito en pixeles (tiene prioridad sobre --ratio).
 *   --quality <1-100>   Calidad AVIF de partida (por defecto 55).
 *   --effort <0-9>      Esfuerzo de compresion AVIF (por defecto 4; mas alto = mas lento y mas pequeno).
 *   --max-kb <n>        Peso maximo objetivo en KB (por defecto 150). Baja la calidad
 *                       automaticamente hasta cumplirlo (suelo de calidad: 25).
 *   --out <dir>         Carpeta destino (por defecto la raiz del repo).
 *   --suffix <txt>      Sufijo de nombre para retina, p. ej. "-2x".
 *   --bg <color>        Color de fondo si la fuente tiene transparencia (por defecto "#ffffff").
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
const QUALITY_FLOOR = 25;

const PRESETS = {
  hero: { width: 1600, ratio: [16, 9], quality: 55 },
  card: { width: 800, ratio: [5, 3], quality: 52 },
  thumb: { width: 160, ratio: [1, 1], quality: 60 },
};

const FOCUS_MAP = {
  center: "center",
  centre: "center",
  top: "north",
  north: "north",
  bottom: "south",
  south: "south",
  left: "west",
  west: "west",
  right: "east",
  east: "east",
  "top-left": "northwest",
  "top-right": "northeast",
  "bottom-left": "southwest",
  "bottom-right": "southeast",
  attention: sharp.strategy.attention,
};

function parseArgs(argv) {
  const opts = {
    width: 1600,
    ratio: null,
    focus: null,
    crop: null,
    quality: 55,
    effort: 4,
    maxKb: 150,
    out: ROOT,
    suffix: "",
    bg: "#ffffff",
    files: [],
    explicit: new Set(),
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--width": opts.width = Number(next()); opts.explicit.add("width"); break;
      case "--ratio": opts.ratio = parseRatio(next()); opts.explicit.add("ratio"); break;
      case "--focus": opts.focus = parseFocus(next()); opts.explicit.add("focus"); break;
      case "--crop": opts.crop = parseCrop(next()); opts.explicit.add("crop"); break;
      case "--quality": opts.quality = Number(next()); opts.explicit.add("quality"); break;
      case "--effort": opts.effort = Number(next()); break;
      case "--max-kb": opts.maxKb = Number(next()); break;
      case "--out": opts.out = path.resolve(ROOT, next()); break;
      case "--suffix": opts.suffix = next(); break;
      case "--bg": opts.bg = next(); break;
      case "--use": {
        const preset = PRESETS[next()];
        if (!preset) throw new Error(`Preset desconocido. Usa: ${Object.keys(PRESETS).join(", ")}`);
        for (const [k, v] of Object.entries(preset)) {
          if (!opts.explicit.has(k)) opts[k] = v;
        }
        break;
      }
      case "--help":
      case "-h":
        console.log(
          "Uso: node scripts/optimizar-imagenes.mjs [archivos...] [--use hero|card|thumb] " +
            "[--width 1600] [--ratio 16:9] [--focus attention] [--crop x,y,w,h] [--quality 55] " +
            "[--effort 4] [--max-kb 150] [--out <dir>] [--suffix -2x] [--bg #fff]"
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

function parseRatio(value) {
  const m = /^(\d+)[:x](\d+)$/.exec(String(value));
  if (!m) throw new Error(`Proporcion invalida: ${value} (usa formato W:H, p. ej. 16:9)`);
  return [Number(m[1]), Number(m[2])];
}

function parseFocus(value) {
  const key = String(value).toLowerCase();
  if (!(key in FOCUS_MAP)) {
    throw new Error(`Punto focal invalido: ${value} (opciones: ${Object.keys(FOCUS_MAP).join(", ")})`);
  }
  return FOCUS_MAP[key];
}

function parseCrop(value) {
  const parts = String(value).split(",").map((n) => Number(n.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0)) {
    throw new Error(`Recorte invalido: ${value} (usa x,y,w,h en pixeles)`);
  }
  const [left, top, width, height] = parts;
  return { left, top, width, height };
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
    if (files.length === 0) throw new Error("La carpeta img-originales/ esta vacia.");
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

/** Construye el pipeline de recorte + resize y devuelve el buffer AVIF a esa calidad. */
async function render(file, opts, quality) {
  let img = sharp(file, { failOn: "none" }).rotate();

  if (opts.crop) {
    img = img.extract(opts.crop);
  } else if (opts.ratio) {
    const [rw, rh] = opts.ratio;
    const height = Math.round((opts.width * rh) / rw);
    img = img.resize({
      width: opts.width,
      height,
      fit: "cover",
      position: opts.focus || "center",
      withoutEnlargement: true,
    });
  } else {
    img = img.resize({ width: opts.width, withoutEnlargement: true });
  }

  return img
    .flatten({ background: opts.bg })
    .avif({ quality, effort: opts.effort })
    .toBuffer();
}

async function optimize(file, opts) {
  const ext = path.extname(file).toLowerCase();
  if (!SOURCE_EXTS.has(ext)) return null;

  const base = slugify(path.basename(file, ext));
  const outName = `${base}${opts.suffix}.avif`;
  const outPath = path.join(opts.out, outName);
  const srcMeta = await sharp(file, { failOn: "none" }).metadata();
  const srcKb = (await stat(file)).size / 1024;

  // Primer intento con la calidad pedida; si supera --max-kb, baja la calidad por pasos.
  let quality = opts.quality;
  let buffer = await render(file, opts, quality);
  while (opts.maxKb > 0 && buffer.length / 1024 > opts.maxKb && quality > QUALITY_FLOOR) {
    quality = Math.max(QUALITY_FLOOR, quality - 5);
    buffer = await render(file, opts, quality);
  }

  await writeFile(outPath, buffer);

  const outMeta = await sharp(buffer).metadata();
  const rel = path.relative(ROOT, outPath).replace(/\\/g, "/");
  const outKb = buffer.length / 1024;
  const saved = srcKb > 0 ? Math.round((1 - outKb / srcKb) * 100) : 0;
  const over = opts.maxKb > 0 && outKb > opts.maxKb;
  const warn = over ? "  <-- SIGUE POR ENCIMA DEL OBJETIVO (sube --effort o recorta mas)" : "";

  console.log(
    `${rel}  ${srcMeta.width}x${srcMeta.height} -> ${outMeta.width}x${outMeta.height}px  ` +
      `q${quality}  ${human(srcKb * 1024)} -> ${human(outKb * 1024)} (-${saved}%)${warn}`
  );

  return { outName, width: outMeta.width, height: outMeta.height };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  await mkdir(opts.out, { recursive: true });
  const files = await collectInputs(opts);

  const recipe = opts.crop
    ? `crop ${opts.crop.left},${opts.crop.top},${opts.crop.width},${opts.crop.height}`
    : opts.ratio
      ? `${opts.ratio[0]}:${opts.ratio[1]}${opts.focus ? ` focus=${opts.focus === sharp.strategy.attention ? "attention" : opts.focus}` : ""}`
      : "sin recorte";
  console.log(
    `Optimizando ${files.length} imagen(es) a AVIF (ancho ${opts.width}px, ${recipe}, calidad ${opts.quality}, max ${opts.maxKb} KB)...\n`
  );

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
  if (results.length) {
    console.log("Dimensiones para el <img> (atributos width/height):");
    for (const r of results) console.log(`  ${r.outName}  ->  width="${r.width}" height="${r.height}"`);
  }
  console.log("Recuerda: alt localizado, loading=\"lazy\" decoding=\"async\" (o preload+fetchpriority=\"high\" si es el hero) y og:image si es la portada.");
}

main().catch((err) => {
  console.error(`\n${err.message}`);
  process.exit(1);
});
