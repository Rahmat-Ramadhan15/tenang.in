"use client";

import { useEffect, useState } from "react";
import { calculateStreak } from "@/lib/streak";

type HistoryItem = {
  id: string;
  sleep: number;
  workload: string;
  mood: string;
  score: number;
  risk: "low" | "medium" | "high";
  createdAt?: string;
};

export default function HistoryPage() {
  const [data, setData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("history");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setData(parsed.reverse()); // terbaru di atas
    } catch {
      localStorage.removeItem("history");
    }
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const avgScore =
    data.length > 0
      ? (data.reduce((acc, item) => acc + (item.score || 0), 0) /
          data.length
        ).toFixed(1)
      : 0;

  const avgSleep =
    data.length > 0
      ? (data.reduce((acc, item) => acc + (item.sleep || 0), 0) /
          data.length
        ).toFixed(1)
      : 0;

  const latestRisk = data[0]?.risk || "low";

  // streak sederhana (jumlah data)
  const streak = calculateStreak(data);

  const getColor = (risk: string) => {
    if (risk === "high") return "bg-red-500";
    if (risk === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getBarColor = (risk: string) => {
    if (risk === "high") return "bg-red-500";
    if (risk === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">History</h1>

      {/* STREAK */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl text-white">
        <h2 className="text-lg font-semibold">
          🔥 {streak} hari berturut-turut!
        </h2>
        <p className="text-sm opacity-80">Pertahankan!</p>
      </div>

      {/* SUMMARY */}
      <div className="bg-[#1a1a22] p-6 rounded-xl border border-gray-800">
        <h2 className="text-white font-semibold mb-4">
          Ringkasan Mingguan
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400">Status Saat Ini</p>
            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${getColor(
                latestRisk
              )}`}
            >
              {latestRisk}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-400">Skor Rata-rata</p>
            <p className="text-white text-xl font-bold">{avgScore}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Tidur Rata-rata</p>
            <p className="text-white text-xl font-bold">
              {avgSleep} jam
            </p>
          </div>
        </div>

        {/* placeholder chart */}
        <div className="h-32 bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
          Chart nanti
        </div>
      </div>

      {/* LIST HISTORY */}
      <div className="bg-[#1a1a22] p-6 rounded-xl border border-gray-800">
        <h2 className="text-white font-semibold mb-4">
          Riwayat Check-in
        </h2>

        <div className="space-y-4">
          {data.map((item, index) => {
            const date = item.createdAt
              ? new Date(item.createdAt)
              : new Date();

            return (
              <div
                key={index}
                className="bg-[#0f0f14] p-4 rounded-lg flex items-center justify-between"
              >
                {/* LEFT */}
                <div>
                  <p className="text-white font-medium">
                    {date.toDateString()}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {item.sleep} jam tidur
                  </p>
                </div>

                {/* BAR */}
                <div className="flex-1 mx-6">
                  <div className="w-full h-2 bg-gray-700 rounded">
                    <div
                      className={`h-2 rounded ${getBarColor(item.risk)}`}
                      style={{ width: `${item.score || 0}%` }}
                    />
                  </div>
                </div>

                {/* BADGE */}
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${getColor(
                    item.risk
                  )}`}
                >
                  {item.risk}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}