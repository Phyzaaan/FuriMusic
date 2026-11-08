export const FURI_DEBUG_KEY = "furi-debug";

export function furiLog(
  event: string,
  details: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  try {
    const logs = JSON.parse(
      localStorage.getItem(FURI_DEBUG_KEY) || "[]"
    );

    logs.push({
      time: new Date().toISOString(),
      event,
      hidden: document.hidden,
      ...details,
    });

    localStorage.setItem(
      FURI_DEBUG_KEY,
      JSON.stringify(logs.slice(-120))
    );
  } catch (error) {
    console.error("Debug logging failed", error);
  }
}