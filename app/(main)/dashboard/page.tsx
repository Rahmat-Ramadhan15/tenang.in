"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BurnoutCard from "@/components/dashboard/BurnoutCard";
import StreakCard from "@/components/dashboard/StreakCard";
import InsightCard from "@/components/dashboard/InsightCard";
import TrendChart from "@/components/dashboard/TrendChart";

interface User {
  nama: string;
  email: string;
}

interface Checkin {
  id: string;

  createdAt: string;

  prediction?: {
    skorBurnout: number;

    labelRisk:
      | "low"
      | "medium"
      | "high";
  };
}

export default function Dashboard() {

  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [latest, setLatest] =
    useState({
      score: 0,

      risk: "low" as
        | "low"
        | "medium"
        | "high",
    });

  const [streak, setStreak] =
    useState(0);

  const [trendText, setTrendText] =
    useState("");

  // =========================
  // FETCH USER
  // =========================
  useEffect(() => {

    const fetchUser =
      async () => {

      try {

        const res =
          await fetch(
            "/api/auth/user"
          );

        const result =
          await res.json();

        if (!res.ok) {

          router.push(
            "/login"
          );

          return;
        }

        setUser(
          result.data
        );

      } catch (error) {

        console.error(
          error
        );

      } finally {

        setLoading(
          false
        );
      }
    };

    fetchUser();

  }, [router]);

  // =========================
  // FETCH CHECKIN
  // =========================
  useEffect(() => {

    const fetchCheckin =
      async () => {

      try {

        const res =
          await fetch(
            "/api/checkin"
          );

        const result =
          await res.json();

        if (
          !res.ok ||
          !result.data
        ) {
          return;
        }

        const checkins:
          Checkin[] =
          result.data;

        if (
          checkins.length === 0
        ) {

          setLatest({
            score: 0,
            risk: "low",
          });

          setTrendText(
            "Lanjutkan check-in untuk melihat tren"
          );

          return;
        }

        // =========================
        // SORT TERBARU
        // =========================
        const sorted =
          [...checkins].sort(
            (a, b) =>
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
          );

        // =========================
        // AGGREGATE SCORE
        // =========================
        const scores =
          sorted.map(
            (item) =>
              item.prediction
                ?.skorBurnout || 0
          );

        const averageScore =
          scores.reduce(
            (
              acc,
              score
            ) =>
              acc + score,
            0
          ) / scores.length;

        const burnoutPercent =
          Math.round(
            averageScore * 100
          );

        let risk:
          | "low"
          | "medium"
          | "high" =
            "low";

        if (
          averageScore >=
          0.7
        ) {

          risk = "high";

        } else if (
          averageScore >=
          0.4
        ) {

          risk =
            "medium";
        }

        setLatest({
          score:
            burnoutPercent,

          risk,
        });

        // =========================
        // STREAK
        // =========================
        setStreak(
          sorted.length
        );

        // =========================
        // TREND
        // =========================
        if (
          sorted.length >= 3
        ) {

          const latest3 =
            sorted.slice(
              0,
              3
            );

          const first =
            Math.round(
              (
                latest3[2]
                  .prediction
                  ?.skorBurnout ||
                0
              ) * 100
            );

          const lastScore =
            Math.round(
              (
                latest3[0]
                  .prediction
                  ?.skorBurnout ||
                0
              ) * 100
            );

          if (
            lastScore >
            first
          ) {

            setTrendText(
              "Burnout meningkat dalam 3 hari terakhir"
            );

          } else if (
            lastScore <
            first
          ) {

            setTrendText(
              "Burnout menurun dalam 3 hari terakhir"
            );

          } else {

            setTrendText(
              "Burnout stabil dalam 3 hari terakhir"
            );
          }

        } else {

          setTrendText(
            "Lanjutkan check-in untuk melihat tren"
          );
        }

      } catch (error) {

        console.error(
          error
        );
      }
    };

    fetchCheckin();

  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout =
    async () => {

    try {

      await fetch(
        "/api/auth/logout",
        {
          method:
            "POST",
        }
      );

      router.push(
        "/login"
      );

    } catch (error) {

      console.error(
        error
      );
    }
  };

  return (

    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-2xl font-bold">
            Dashboard
          </h2>

          <p className="text-gray-400 text-sm">
            Ringkasan kesehatan mentalmu hari ini
          </p>

        </div>

        {/* USER */}
        <div className="flex items-center gap-4">

          {/* PROFILE CARD */}
          <Link
            href="/profile"
            className="flex items-center gap-4 bg-[#1f1f27] px-4 py-2 rounded-2xl border border-gray-800 hover:border-purple-500 hover:scale-[1.02] transition"
          >

            {/* TEXT */}
            <div className="text-right">

              <p className="text-sm font-semibold text-white">

                {loading
                  ? "Loading..."
                  : user?.nama ||
                    "User"}

              </p>

              <p className="text-xs text-gray-400">

                {user?.email || ""}

              </p>

            </div>

            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white">

              {user?.nama?.charAt(
                0
              ) || "U"}

            </div>

          </Link>

          {/* LOGOUT */}
          <button
            onClick={
              handleLogout
            }
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm transition"
          >
            Logout
          </button>

        </div>

      </div>

      {/* TOP */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="col-span-2">

          <BurnoutCard
            score={
              latest.score
            }
            risk={
              latest.risk
            }
            trend={
              trendText
            }
          />

        </div>

        <StreakCard
          streak={
            streak
          }
        />

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