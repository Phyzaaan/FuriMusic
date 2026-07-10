import { NextRequest, NextResponse } from "next/server";

function getVideoId(url: string): string | null {
  const parsed = new URL(url);

  // https://youtu.be/Cclxu9T0tcQ?si=...
  if (parsed.hostname === "youtu.be") {
    return parsed.pathname.slice(1);
  }

  // https://www.youtube.com/watch?v=Cclxu9T0tcQ
  if (
    parsed.hostname.includes("youtube.com") &&
    parsed.pathname === "/watch"
  ) {
    return parsed.searchParams.get("v");
  }

  // https://www.youtube.com/shorts/Cclxu9T0tcQ
  if (
    parsed.hostname.includes("youtube.com") &&
    parsed.pathname.startsWith("/shorts/")
  ) {
    return parsed.pathname.split("/")[2];
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { youtubeUrl } = await req.json();

    const videoId = getVideoId(youtubeUrl);

    if (!videoId) {
      throw new Error("Invalid YouTube URL.");
    }

    const res = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${encodeURIComponent(videoId)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch audio URL" },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      downloadUrl: data.link,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}