"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckinPage() {
  const [journal, setJournal] = useState("");
  const [sleep, setSleep] = useState(6);
  const [workload, setWorkload] = useState("medium");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!journal) {
      alert("Isi jurnal dulu");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ journal, sleep, workload, mood }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        alert("Response server rusak");
        setLoading(false);
        return;
      }

      // ❌ kalau error dari backend
      if (!res.ok) {
        alert(data?.message || "Gagal check-in");
        setLoading(false);
        return;
      }

      // ❌ kalau struktur gak sesuai
      if (!data || !data.data) {
        console.error("Invalid response:", data);
        alert("Data dari server tidak valid");
        setLoading(false);
        return;
      }

      // ✅ FIX: ambil dari burnout
      const result = {
        score: data.data.burnout.score,
        risk: data.data.burnout.risk,
        sleep: data.data.sleep,
        workload: data.data.workload,
      };

      localStorage.setItem("result", JSON.stringify(result));

      router.push("/result");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  const moods = [
    { label: "sad", emoji: "😢" },
    { label: "bad", emoji: "🙁" },
    { label: "neutral", emoji: "😐" },
    { label: "good", emoji: "🙂" },
    { label: "excellent", emoji: "😁" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold">Daily Check-in</h1>

        {/* JOURNAL */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-3 text-sm text-gray-300">
            Apa yang kamu rasakan hari ini?
          </p>

          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0f0f14] border border-gray-700 focus:border-purple-500 outline-none"
            placeholder="Hari ini cukup melelahkan karena..."
          />
        </div>

        {/* SLEEP */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-3 text-sm text-gray-300">
            🌙 Durasi tidur semalam
          </p>

          <input
            type="range"
            min="0"
            max="12"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
            className="w-full accent-purple-500"
          />

          <p className="text-center mt-2 text-purple-400 font-bold">
            {sleep} jam
          </p>
        </div>

        {/* WORKLOAD */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-3 text-sm text-gray-300">
            ⚡ Tingkat Aktivitas
          </p>

          <div className="flex gap-3">
            {["low", "medium", "high"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setWorkload(item)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
                  workload === item
                    ? "bg-purple-600 scale-105"
                    : "bg-[#0f0f14] border border-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* MOOD */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-4 text-sm text-gray-300">
            😊 Mood hari ini
          </p>

          <div className="grid grid-cols-5 gap-4">
            {moods.map((item) => {
              const active = mood === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setMood(item.label)}
                  className={`h-24 rounded-xl border ${
                    active
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-700"
                  }`}
                >
                  <div className="text-2xl">{item.emoji}</div>
                  <div className="text-xs capitalize">
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl"
        >
          {loading ? "Analyzing..." : "Analyze My Condition"}
        </button>

      </div>
    </div>
  );
}