"use client";
import { useState, type KeyboardEvent } from "react";
import { SecondaryBtn } from "../ui/components/Buttons";
import { songDetails } from "@/app/utils/data/type";
import SongEditor from "./section/SongEditor";
import Image from "next/image";

const platformCards = [
  { name: "YouTube", icon: "/logos/youtube.svg", description: "Paste a song link and we’ll pull the details in." }
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
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch song details.");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong while fetching the song.");
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
    <main className="no-scrollbar flex h-full w-full flex-col items-center gap-8 overflow-y-auto px-4 pb-20 pt-22">
      <section className="flex w-full max-w-5xl flex-col items-center gap-6 sm:p-8">
        <div className="flex w-full max-w-2xl flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Suggest me your favorite song
          </h1>
          <p className="max-w-xl text-base text-secondary sm:text-lg">
            Paste a song link below and we’ll turn it into a polished recommendation in seconds.
          </p>
        </div>

        <form
          className="flex w-full max-w-3xl flex-col gap-3 rounded-xl border border-card-border bg-dark-bg/70 p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleUpload();
          }}
        >
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="song-url">
              Song URL
            </label>
            <input
              id="song-url"
              type="url"
              placeholder="Paste your favorite song link here..."
              className="h-12 w-full rounded-xl border border-card-border bg-white/5 px-4 text-base text-primary outline-none transition placeholder:text-tertiary focus:border-white/30 focus:bg-white/[0.07]"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              value={url}
            />
            <SecondaryBtn
              type="submit"
              disabled={loading || !url.trim()}
              className="h-10 sm:h-12 whitespace-nowrap rounded-xl border border-white/10 bg-primary-gradient px-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(102,126,234,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:text-secondary"
            >
              {loading ? "Submitting..." : "Submit song"}
            </SecondaryBtn>
          </div>

          <p className="px-1 text-sm text-tertiary">
            Tip: paste a direct YouTube song link for the best results.
          </p>
        </form>
      </section>

      <section className="flex w-full max-w-5xl flex-col gap-5 rounded-xl border border-card-border bg-card-bg/50 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-center justify-between gap-3 border-b border-card-border pb-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-[0.2em] text-secondary uppercase">
              Supported sources
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Platforms
            </h2>
          </div>
        </div>

        <div className="grid gap-4">
          {platformCards.map((card) => (
            <article
              key={card.name}
              className="group flex flex-col gap-3 rounded-xl border border-card-border bg-white/3 p-4 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[0_16px_35px_rgba(255,255,255,0.05)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Image src={card.icon} alt={card.name} width={24} height={24} />
                </div>
                <h3 className="text-lg font-semibold text-white">{card.name}</h3>
              </div>
              <p className="text-sm leading-6 text-secondary">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      {(song && showEditor) && <SongEditor Song={song} showEditor={showEditor} setShowEditor={setShowEditor} />}
    </main>
  );
}

