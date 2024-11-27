/* TODO: Extend whitelist or find better option for secure image proxy use  */
const allowedDomains = ["imgur.com", "cdn.discordapp.com", "r2.fivemanage.com"];
const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providedImageUrl = searchParams.get("url");

  if (!providedImageUrl) {
    return new Response(
      JSON.stringify({
        error: "Please provide a valid image",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const imageUrl = new URL(providedImageUrl);

  console.log(imageUrl.hostname);

  if (!allowedDomains.some((domain) => imageUrl.hostname.endsWith(domain))) {
    return new Response(
      JSON.stringify({
        error: "This domain is not allowed",
      }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  if (imageUrl.protocol !== "https:") {
    return new Response(
      JSON.stringify({ error: "Please use https as protocol" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error("Failed to fetch image from url");
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !allowedContentTypes.includes(contentType)) {
      return new Response(JSON.stringify({ error: "Invalid content type" }), {
        status: 400,
      });
    }

    const maxSize = 5 * 1024 * 1024;
    const contentLength = response.headers.get("content-length");

    if (contentLength && parseInt(contentLength, 10) > maxSize) {
      return new Response(JSON.stringify({ error: "Image too large" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Image fetching error:", error);
    return new Response(
      JSON.stringify({
        error: "Request timed out or failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
