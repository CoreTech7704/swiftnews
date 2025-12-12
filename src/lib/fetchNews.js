// src/lib/fetchNews.js
export async function fetchNews({ country = "in", category = "general", page = 1, max = 12 } = {}) {
  const params = new URLSearchParams({
    country,
    category,
    page: String(page),
    max: String(max),
  });

  const url = `/api/news?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`News proxy failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const data = await res.json();
  // tolerant mapping for common shapes
  const articles = data.articles ?? data.results ?? data.items ?? data;
  return Array.isArray(articles) ? articles : { raw: data };
}
