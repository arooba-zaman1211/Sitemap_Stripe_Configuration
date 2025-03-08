import axios from "axios";

export async function GET() {
  const backendUrl = "http://localhost:5000/sitemap-data";

  try {
    const { data: users } = await axios.get(backendUrl);
    console.log("Fetched users from API:", users);

    if (!Array.isArray(users) || users.length === 0) {
      console.error("❌ ERROR: Sitemap data is empty or invalid.");
      return new Response("Error: No valid sitemap data.", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const escapeXml = (str) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${users
  .map(
    (user) =>
      `<url>
<loc>${escapeXml(user.loc)}</loc>
<lastmod>${user.lastmod}</lastmod>
<changefreq>${user.changefreq}</changefreq>
<priority>${user.priority}</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

    console.log("✅ Generated Sitemap:", sitemap);

    return new Response(sitemap.trim(), {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching sitemap data:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><error>${error.message}</error>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml" },
      }
    );
  }
}

export const dynamic = "force-dynamic";
