"use client";

import { useState } from "react";
import { FURI_DEBUG_KEY } from "../utils/libs/debug";

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState("");

  function loadLogs() {
    setLogs(
      localStorage.getItem(FURI_DEBUG_KEY) || "No logs found."
    );
  }

  async function copyLogs() {
    await navigator.clipboard.writeText(logs);
  }

  return (
    <main className="no-scrollbar flex h-full w-full flex-col items-center gap-5 overflow-y-auto pt-22 pb-20">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-xl bg-black text-white px-4 py-3"
      >
        Furi Debug
      </button>

      {open && (
        <div className="absolute bottom-14 right-0 w-[90vw] max-w-lg bg-white text-black rounded-xl p-3 shadow-xl">
          <div className="flex gap-2 mb-3">
            <button onClick={loadLogs}>
              Load logs
            </button>

            <button onClick={copyLogs}>
              Copy logs
            </button>
          </div>

          <textarea
            readOnly
            value={logs}
            className="w-full h-80 border rounded-lg p-2 text-xs"
          />
        </div>
      )}
    </main>
  );
}