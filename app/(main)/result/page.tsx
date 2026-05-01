"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("result");

    if (!stored || stored === "undefined") {
      console.warn("No valid data in localStorage");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setData(parsed);
    } catch (err) {
      console.error("JSON error:", err);
      localStorage.removeItem("result");
    }
  }, []);

  const handleBackToCheckin = () => {
    localStorage.removeItem("result"); 
    router.push("/checkin");
  };

  if (!data) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Tidak ada data. Silakan check-in dulu.
      </div>
    );
  }

  const percentage = data.score || 0;

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  const color =
    data.risk === "high"
      ? "#ef4444"
      : data.risk === "medium"
      ? "#facc15"
      : "#a855f7";

 return (
  <div className="p-6 max-w-5xl mx-auto">

    {/* TITLE */}
    <h1 className="text-3xl font-bold mb-6">
      Hasil Analisis
    </h1>

    {/* CARD UTAMA */}
    <div className="bg-[#1a1a22] border border-gray-800 rounded-2xl p-6 mb-6">

      <p className="text-sm text-gray-400 mb-3">
        Penilaian Risiko Burnout
      </p>

      <div className="flex items-center justify-between">

        {/* SCORE */}
        <div>
          <p
            className={`text-5xl font-bold ${
              data.risk === "high"
                ? "text-red-500"
                : data.risk === "medium"
                ? "text-yellow-400"
                : "text-purple-400"
            }`}
          >
            {percentage}%
          </p>

          <p className="text-gray-400 mt-2 text-sm">
            Tingkat Kepercayaan
          </p>

          <div className="w-64 h-2 bg-gray-700 rounded-full mt-2">
            <div
              className="h-2 bg-purple-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* CIRCLE */}
        <div className="w-28 h-28 rounded-full border-8 border-purple-500 flex items-center justify-center text-xl font-bold">
          {percentage}%
        </div>

      </div>
    </div>

    {/* GRID INFO */}
    <div className="grid grid-cols-3 gap-4 mb-6">

      <div className="bg-[#1a1a22] border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">Sentimen</p>
        <p className="text-lg font-bold capitalize">
          {data.mood || "Unknown"}
        </p>
      </div>

      <div className="bg-[#1a1a22] border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">Tidur</p>
        <p className="text-lg font-bold">
          {data.sleep} jam
        </p>
      </div>

      <div className="bg-[#1a1a22] border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">Tren</p>
        <p className="text-lg font-bold">
          {data.risk === "high" ? "Meningkat" : "Stabil"}
        </p>
      </div>

    </div>

    {/* PENJELASAN */}
    <div className="bg-[#1a1a22] border border-gray-800 rounded-xl p-5 mb-6">
      <h3 className="font-semibold mb-2">
        Penjelasan
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed">
        Kombinasi workload {data.workload} dan durasi tidur {data.sleep} jam 
        menunjukkan kondisi mental Anda saat ini. Jika kondisi ini berlanjut, 
        risiko burnout dapat meningkat.
      </p>
    </div>

    {/* REKOMENDASI */}
    <div className="bg-[#1a1a22] border border-gray-800 rounded-xl p-5 mb-6">
      <h3 className="font-semibold mb-3">
        Rekomendasi
      </h3>

      <div className="space-y-3 text-sm text-gray-400">
        <div className="bg-[#0f0f14] p-3 rounded-lg">
          ✔ Tidur minimal 7 jam malam ini
        </div>

        <div className="bg-[#0f0f14] p-3 rounded-lg">
          ✔ Kurangi workload jika memungkinkan
        </div>

        <div className="bg-[#0f0f14] p-3 rounded-lg">
          ✔ Luangkan waktu relaksasi 15 menit
        </div>
      </div>
    </div>

    {/* BUTTON */}
    <div className="flex gap-4">

      <button
        onClick={handleBackToCheckin}
        className="w-full bg-gray-700 py-3 rounded-xl hover:opacity-90"
      >
        Kembali
      </button>

      <button
        onClick={() => alert("Saved")}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-xl"
      >
        Simpan Hasil
      </button>

    </div>

  </div>
);
}