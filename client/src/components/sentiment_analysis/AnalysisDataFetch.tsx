import { useState } from "react";
import type { Props, SentimentCount, SetSentimentType } from "./types";

const AnalysisDataFetch = ({
  name,
  setName,
  setSentimentArray,
}: Props & Pick<SetSentimentType, "setSentimentArray">) => {
  const [loading, setLoading] = useState<"analyze" | "download" | null>(null);

  const handleImport = async () => {
    if (!name.trim()) {
      alert("Please enter a trainer name.");
      return;
    }
    try {
      setLoading("analyze");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analysis/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        alert("Fetching analysis failed");
        return;
      }

      const data: SentimentCount[] = await response.json();
      setSentimentArray(data);
    } finally {
      setLoading(null);
    }
  };

  const handleExport = async () => {
    if (!name.trim()) {
      alert("Enter a trainer name before downloading.");
      return;
    }
    try {
      setLoading("download");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analysis/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        alert("Export failed");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${name}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div
        className="
          shadow-xl rounded-2xl bg-white/10 backdrop-blur-md 
          border border-white/20 
          p-6 min-h-[180px]
          flex flex-col gap-4 w-full
        "
      >
        <p className="text-xl font-semibold text-white">📄 Analysis Generator</p>

        {/* Full-width row container */}
        <div className="flex flex-col md:flex-row items-center md:items-center w-full gap-4">

          {/* SEARCH BAR — takes all remaining space */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Enter trainer / search keyword"
            className="
              flex-grow                /* 🔥 search bar stretches fully */
              py-3 px-4 rounded-xl
              bg-gray-300/40 border border-gray-300
              text-black focus:bg-white focus:ring-2 outline-none
              transition
              w-full
            "
          />

          {/* BUTTONS — stick to RIGHT EDGE */}
          <div className="flex gap-4 shrink-0">

            <button
              onClick={handleImport}
              disabled={loading === "analyze"}
              className={`
                w-[170px] h-[50px]      /* 👈 bigger width + height */
                rounded-xl 
                text-white text-lg font-semibold
                shadow-lg transition
                ${loading === "analyze"
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-600 active:scale-95"}
              `}
            >
              {loading === "analyze" ? "Loading…" : "Show analysis"}
            </button>

            <button
              onClick={handleExport}
              disabled={loading === "download"}
              className={`
                w-[170px] h-[50px]
                rounded-xl 
                text-white text-lg font-semibold
                shadow-lg transition
                ${loading === "download"
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 active:scale-95"}
              `}
            >
              {loading === "download" ? "Downloading…" : "Download"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default AnalysisDataFetch;