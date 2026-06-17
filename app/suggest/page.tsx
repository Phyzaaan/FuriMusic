"use client";
import { useState } from "react";
import { uploadSuggestion } from "../utils/data/data";
import { SecondaryBtn } from "../ui/components/Buttons";
import { PopUpMsg } from "../ui/components/Error";

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<number | null>(null);

  async function handleUpload() {
    if (!url) return;
    const res = await uploadSuggestion(url);
    setStatus(res);
  }

  return (
    <main className="no-scrollbar flex h-full w-full flex-col items-center gap-5 overflow-y-auto pt-22 pb-20">
      <h1 className="text-3xl font-bold">Suggest Me!</h1>
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
        <SecondaryBtn onClick={handleUpload}>Submit</SecondaryBtn>
      </div>

      <PopUpMsg title={status == 200 ? "Thanks for Your Suggestion" : "Oopse! Somting Not Good!"} 
        details={status == 200 ? "I will personally review your song and I will add if I like it..." : "Please try again in a jiffy!"}
        onClick={() => setStatus(null)}
        show={!!status}
      />
    </main>
  );
}

