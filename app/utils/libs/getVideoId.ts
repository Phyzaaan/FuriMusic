
export default function getVideoId(url: string): string | null {
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
