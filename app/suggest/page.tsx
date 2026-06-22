"use client";
import { useState } from "react";
import { SecondaryBtn } from "../ui/components/Buttons";
import { Song } from "../utils/data/type";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false)

  async function handleUpload() {
    if (!url) return;
    setLoading(true)
    try {
      const response = await fetch("/api/fetchSong", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }),
      });

      const data = await response.json();
      if (response.ok) {
        const song = data as Song;
        confirm(JSON.stringify(song))
        alert(JSON.stringify(song))
        console.log(data)
        setUrl("");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="no-scrollbar flex h-full w-full flex-col items-center gap-5 overflow-y-auto pt-22 pb-20">
      <p className="w-3/4 text-primary text-center">
        Help me find Amazing Songs! Just paste the link to your favorite song right below!
      </p>

      <div className="flex items-center mx-auto gap-5 py-6">
        <input
          type="url"
          placeholder="Paste you link here..."
          className="bg-dark-bg border-card-border flex w-80 items-center justify-between rounded-sm border px-2 py-1"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
        <SecondaryBtn onClick={handleUpload} disabled={loading}>{loading ? "Submiting" : "Submit"}</SecondaryBtn>
      </div>
    </main>
  );
}

