// api/news.js
// Vercel Serverless proxy for GNews

export default async function handler(req, res) {
  try {
    const { country = "in", category = "general", page = "1", max = "12", lang = "en" } = req.query;
    const key = process.env.GNEWS_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "Server missing GNEWS_API_KEY env var" });
    }

    const upstream = new URL("https://gnews.io/api/v4/top-headlines");
    upstream.searchParams.set("category", category);
    upstream.searchParams.set("country", country);
    upstream.searchParams.set("lang", lang);
    upstream.searchParams.set("max", max);
    upstream.searchParams.set("page", page);
    upstream.searchParams.set("apikey", key);

    const upstreamResp = await fetch(upstream.toString());
    const text = await upstreamResp.text();

    // Mirror upstream status, content-type, and short caching
    res.status(upstreamResp.status);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    res.setHeader("Content-Type", "application/json");
    // (optional) allow requests from other origins too — harmless for same-origin calls
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Forward JSON if valid, otherwise forward raw text
    try {
      const json = JSON.parse(text);
      return res.send(JSON.stringify(json));
    } catch (e) {
      return res.send(text);
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(502).json({ error: "Upstream fetch failed", details: String(err) });
  }
}
