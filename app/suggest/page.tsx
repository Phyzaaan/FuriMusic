"use client";
import { useState, type KeyboardEvent } from "react";
import { SecondaryBtn } from "../ui/components/Buttons";
import { songDetails } from "@/app/utils/data/type";
import SongEditor from "./section/SongEditor";
import Image from "next/image";

const platformCards = [
  { name: "YouTube", icon: "/logos/youtube.webp", description: "Paste a song link and we’ll pull the details in." }
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState<songDetails>();
  const [showEditor, setShowEditor] = useState(false);

  async function handleUpload() {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/fetchSong", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        const song = data as songDetails;
        setSong(song);
        setShowEditor(true);
        setUrl("");
      } else {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          alert(errorData.error || "Something went wrong");
        } else {
          const errorText = await response.text();
          console.error("Server HTML Error:", errorText);
          alert("Server crashed or returned an invalid response.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching the song.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleUpload();
    }
  }

  return (
    <main className="no-scrollbar flex h-full w-full flex-col items-center overflow-y-auto px-4 pb-20 pt-22 gap-8">

      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-2">
          Suggest me your favorite song
        </h1>
        <p className="text-secondary indent-2">
          Paste a song link below and we’ll help you turn it into a polished suggestion in seconds.
        </p>
      </div>

      <div className="w-full flex flex-col items-center gap-2">
        <div className="w-full flex items-center justify-center gap-2">
          <input
            type="url"
            placeholder="Paste your favorite song link here..."
            className="w-1/2 rounded-lg border border-card-border bg-dark-bg px-2 py-1 text-lg text-primary transition"
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            value={url}
          />
          <SecondaryBtn
            type="submit"
            onClick={handleUpload}
            disabled={loading || !url.trim()}
            className="text-sm py-2 px-4 rounded-lg transition disabled:text-secondary"
          >
            {loading ? "Submitting..." : "Submit song"}
          </SecondaryBtn>
        </div>
        <p className="mt-3 text-sm text-tertiary">
          Tip: paste a direct YouTube song link for the best results.
        </p>

      </div>

    <div className="w-full flex flex-col items-center gap-4">

      <div className="w-full border border-card-border" />
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Supported Platforms
      </h1>
      <div className="w-3/4 mt-8 grid gap-4 ">
        {platformCards.map((card) => (
          <div
            key={card.name}
            className="rounded-lg border border-card-border bg-white/5 py-2 px-2 gap-8 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg hover:shadow-white/10"
          >
            <div className="w-full flex items-center gap-1">
              <Image src={card.icon} alt={card.name} width={30} height={30} />
              <h3 className="mt-3 font-semibold text-white">{card.name}</h3>
            </div>
            <p className="text-sm indent-5 text-secondary">{card.description}</p>
          </div>
        ))}
      </div>
    </div>

      {(song && showEditor) && <SongEditor Song={song} showEditor={showEditor} setShowEditor={setShowEditor} />}
    </main>
  );
}

