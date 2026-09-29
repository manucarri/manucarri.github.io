import os
import re
from datetime import datetime

DOMAIN = "https://clasespadelvalencia.com"

# Páginas que NO son artículos individuales del blog
NON_BLOG_PAGES = {
    "index.html", "index-en.html",
    "blog.html", "blog-en.html",
    "sobre-mi.html", "about-me.html",
    "condiciones.html", "terms.html",
    "404.html", "review-club.html"
}

# Páginas que NO deben ir en el sitemap.xml (noindex)
NOINDEX_PAGES = {"condiciones.html", "terms.html", "404.html", "review-club.html"}


def extract_meta(html, filename):
    # Idioma
    lang_match = re.search(r'<html[^>]*lang=["\'](es|en)["\']', html, re.I)
    lang = lang_match.group(1).lower() if lang_match else "es"

    # Título (H1 o og:title o title)
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.I | re.S)
    if h1_match:
        title = re.sub(r'<[^>]+>', '', h1_match.group(1)).strip()
    else:
        title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.I | re.S)
        title = title_match.group(1).split('|')[0].strip() if title_match else filename

    # Descripción
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.I | re.S)
    if not desc_match:
        desc_match = re.search(r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']', html, re.I | re.S)
    description = desc_match.group(1).strip() if desc_match else ""

    # Categoría (span encima del H1)
    cat_match = re.search(r'<span[^>]*uppercase[^>]*>(.*?)</span>\s*<h1', html, re.I | re.S)
    category = re.sub(r'<[^>]+>', '', cat_match.group(1)).strip() if cat_match else ("Biomecánica" if lang == "es" else "Biomechanics")

    # Imagen principal
    img_match = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\'](.*?)["\']', html, re.I)
    if img_match:
        image = img_match.group(1).replace(f"{DOMAIN}/", "").strip()
    else:
        img_tag = re.search(r'<img[^>]+src=["\']([^"\']+\.avif)["\']', html, re.I)
        image = img_tag.group(1) if img_tag else "profesor-padel-valencia.avif"

    # Alt de la primera imagen
    alt_match = re.search(rf'<img[^>]+src=["\'][^"\']*{re.escape(image)}["\'][^>]+alt=["\'](.*?)["\']', html, re.I | re.S)
    alt = alt_match.group(1).strip() if alt_match else title

    # Fecha de publicación (Schema datePublished o fecha actual)
    date_match = re.search(r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"', html)
    date_str = date_match.group(1) if date_match else datetime.utcnow().strftime("%Y-%m-%d")

    return {
        "filename": filename,
        "lang": lang,
        "title": title,
        "description": description,
        "category": category,
        "image": image,
        "alt": alt,
        "date": date_str
    }


def build_blog_card(post):
    read_more = "Leer artículo" if post["lang"] == "es" else "Read article"
    return f"""            <!-- AUTO-POST: {post['filename']} -->
            <article class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                <div class="h-56 overflow-hidden relative">
                    <img src="{post['image']}" alt="{post['alt']}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                    <div class="absolute top-4 left-4 bg-white text-padel-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{post['category']}</div>
                </div>
                <div class="p-8 flex flex-col flex-grow">
                    <h2 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-padel-600 transition-colors leading-tight">
                        <a href="{post['filename']}">{post['title']}</a>
                    </h2>
                    <p class="text-gray-600 mb-6 flex-grow text-sm">{post['description']}</p>
                    <a href="{post['filename']}" class="text-padel-600 font-bold flex items-center gap-2 hover:text-padel-900 transition-colors text-sm">
                        {read_more} <i data-lucide="arrow-right" class="h-4 w-4"></i>
                    </a>
                </div>
            </article>"""


def build_home_card(post):
    return f"""                    <a href="{post['filename']}" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col sm:flex-row">
                        <div class="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative">
                            <img src="{post['image']}" alt="{post['alt']}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                        </div>
                        <div class="p-6 md:p-8 w-full sm:w-3/5 flex flex-col justify-center">
                            <span class="text-padel-600 text-xs font-bold uppercase tracking-widest mb-2 block">{post['category']}</span>
                            <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-padel-600 transition-colors leading-tight">{post['title']}</h3>
                            <p class="text-gray-600 text-sm">{post['description']}</p>
                        </div>
                    </a>"""


def update_blog_index(index_file, posts):
    if not os.path.exists(index_file):
        return None
    with open(index_file, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(r'(<!-- BLOG-LIST-START -->)(.*?)(<!-- BLOG-LIST-END -->)', re.S)
    match = pattern.search(content)
    if not match:
        return None

    inner_html = match.group(2)
    # Comprobar qué artículos faltan en el listado y añadirlos arriba
    new_cards = []
    for post in sorted(posts, key=lambda x: x["date"], reverse=True):
        if post["filename"] not in inner_html:
            new_cards.append(build_blog_card(post))

    if new_cards:
        updated_inner = "\n" + "\n\n".join(new_cards) + "\n" + inner_html
        content = pattern.sub(rf'\1{updated_inner}\3', content)
        with open(index_file, "w", encoding="utf-8") as f:
            f.write(content)

    # Extraer el primer artículo listado en blog.html para ponerlo en la Home
    first_href = re.search(r'<h2[^>]*>\s*<a\s+href=["\']([^"\']+)["\']', match.group(2) if not new_cards else updated_inner, re.I | re.S)
    return first_href.group(1) if first_href else None


def update_home(home_file, latest_post):
    if not os.path.exists(home_file) or not latest_post:
        return
    with open(home_file, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(r'(<!-- HOME-LATEST-START -->)(.*?)(<!-- HOME-LATEST-END -->)', re.S)
    if pattern.search(content):
        home_card = "\n" + build_home_card(latest_post) + "\n                    "
        new_content = pattern.sub(rf'\1{home_card}\3', content)
        if new_content != content:
            with open(home_file, "w", encoding="utf-8") as f:
                f.write(new_content)


def generate_sitemap(all_html_files, posts_by_file):
    today = datetime.utcnow().strftime("%Y-%m-%d")
    urls = []

    # Prioridades SEO
    priority_map = {
        "index.html": ("1.0", "weekly"),
        "index-en.html": ("0.9", "weekly"),
        "blog.html": ("0.8", "weekly"),
        "blog-en.html": ("0.8", "weekly"),
        "sobre-mi.html": ("0.8", "monthly"),
        "about-me.html": ("0.8", "monthly"),
    }

    for f in sorted(all_html_files):
        if f in NOINDEX_PAGES:
            continue
        loc = f"{DOMAIN}/" if f == "index.html" else f"{DOMAIN}/{f}"
        prio, freq = priority_map.get(f, ("0.7", "monthly"))
        lastmod = posts_by_file[f]["date"] if f in posts_by_file else today
        urls.append(f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{prio}</priority>
  </url>""")

    sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>
"""
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)


def main():
    all_html = [f for f in os.listdir(".") if f.endswith(".html") and os.path.isfile(f)]
    posts_es = []
    posts_en = []
    posts_by_file = {}

    for filename in all_html:
        if filename in NON_BLOG_PAGES:
            continue
        with open(filename, "r", encoding="utf-8") as f:
            html = f.read()
        if 'noindex' in html.lower():
            continue
        meta = extract_meta(html, filename)
        posts_by_file[filename] = meta
        if meta["lang"] == "en":
            posts_en.append(meta)
        else:
            posts_es.append(meta)

    latest_es_file = update_blog_index("blog.html", posts_es)
    latest_en_file = update_blog_index("blog-en.html", posts_en)

    if latest_es_file and latest_es_file in posts_by_file:
        update_home("index.html", posts_by_file[latest_es_file])
    if latest_en_file and latest_en_file in posts_by_file:
        update_home("index-en.html", posts_by_file[latest_en_file])

    generate_sitemap(all_html, posts_by_file)


if __name__ == "__main__":
    main()
