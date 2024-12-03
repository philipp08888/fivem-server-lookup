import { NextResponse } from "next/server";

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

  console.log(request.url);

  if (!providedImageUrl) {
    return NextResponse.json(
      { error: "Please provide a valid image url" },
      { status: 400 }
    );
  }

  const imageUrl = new URL(providedImageUrl);

  if (!allowedDomains.some((domain) => imageUrl.hostname.endsWith(domain))) {
    return NextResponse.json(
      { error: "This domain is not allowed." },
      { status: 403 }
    );
  }

  if (imageUrl.protocol !== "https:") {
    return NextResponse.json(
      { error: "Please use https as protocol" },
      { status: 400 }
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
      return NextResponse.json(
        { error: "Failed to fetch image from url" },
        { status: 500 }
      );
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !allowedContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const maxSize = 32 * 1024 * 1024;
    const contentLength = response.headers.get("content-length");

    if (contentLength && parseInt(contentLength, 10) > maxSize) {
      return NextResponse.json(
        { error: "Image too large (max 32mb)" + contentLength },
        { status: 400 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    const base64 = searchParams.get("base64");

    if (base64 && base64 === "true") {
      const imageBase64 = arrayBufferToBase64(imageBuffer);

      return NextResponse.json({ data: imageBase64 }, { status: 200 });
    }

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Image fetching error:", error);
    return NextResponse.json(
      { error: "Request timed out or failed" },
      { status: 500 }
    );
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  return Buffer.from(binary, "binary").toString("base64");
}
