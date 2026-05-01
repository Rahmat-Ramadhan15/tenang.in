"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import BurnoutCard from "@/components/dashboard/BurnoutCard";
import StreakCard from "@/components/dashboard/StreakCard";
import InsightCard from "@/components/dashboard/InsightCard";
import TrendChart from "@/components/dashboard/TrendChart";

import { calculateStreak } from "@/lib/streak";

interface User {
  name: string;
  email: string;
}

interface HistoryItem {
  score?: number;
  risk?: "low" | "medium" | "high";
  createdAt?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [streak, setStreak] = useState(0);

  const [latest, setLatest] = useState({
    score: 0,
    risk: "low" as "low" | "medium" | "high",
  });

  const [trendText, setTrendText] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // =========================
    // AMBIL HISTORY
    // =========================
    const history: HistoryItem[] = JSON.parse(
      localStorage.getItem("history") || "[]"
    );

    if (history.length > 0) {
      // 🔥 STREAK
      const result = calculateStreak(history);
      setStreak(result);

      // 🔥 SORT BERDASARKAN TANGGAL
      const sorted = history
        .filter((item) => item.createdAt)
        .sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() -
            new Date(b.createdAt!).getTime()
        );

      const last = sorted[sorted.length - 1];

      setLatest({
        score: last?.score ?? 0,
        risk: last?.risk ?? "low",
      });

      // =========================
      // TREND 3 HARI TERAKHIR
      // =========================
      if (sorted.length >= 3) {
        const last3 = sorted.slice(-3);

        const first = last3[0].score ?? 0;
        const lastScore = last3[2].score ?? 0;

        if (lastScore > first) {
          setTrendText("Kondisi meningkat dalam 3 hari terakhir");
        } else if (lastScore < first) {
          setTrendText("Kondisi menurun dalam 3 hari terakhir");
        } else {
          setTrendText("Kondisi stabil dalam 3 hari terakhir");
        }
      } else {
        setTrendText("Lanjutkan check-in untuk melihat tren harianmu");
      }
    } else {
      setStreak(0);
      setLatest({
        score: 0,
        risk: "low",
      });
      setTrendText("");
    }
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-400 text-sm">
            Ringkasan kesehatan mentalmu hari ini
          </p>
        </div>

        {/* USER */}
        <div className="flex items-center gap-4 bg-[#1f1f27] px-4 py-2 rounded-xl border border-gray-800">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">
              {loading ? "Loading..." : user?.name || "User"}
            </p>
            <p className="text-xs text-gray-400">
              {user?.email || ""}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>
      </div>

      {/* TOP */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <BurnoutCard
            score={latest.score}
            risk={latest.risk}
            trend={trendText}
          />
        </div>

        <StreakCard streak={streak} />
      </div>

      {/* CHART */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <TrendChart />
        </div>

        <InsightCard />
      </div>

      {/* BUTTON */}
      <Link
        href="/checkin"
        className="block text-center bg-gradient-to-r from-purple-600 to-purple-800 p-5 rounded-2xl hover:opacity-90 transition"
      >
        + Start Daily Check-in
      </Link>
    </div>
  );
}