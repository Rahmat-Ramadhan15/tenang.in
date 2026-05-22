"use client";

import {
  useEffect,
  useState,
} from "react";

interface UserData {
  nama: string;
  email: string;
}

interface CheckinData {
  prediction?: {
    skorBurnout: number;
    labelRisk: string;
  };
}

export default function ProfilePage() {

  const [user, setUser] =
    useState<UserData | null>(
      null
    );

  const [checkins, setCheckins] =
    useState<CheckinData[]>([]);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          // USER
          const userRes =
            await fetch(
              "/api/auth/user"
            );

          const userResult =
            await userRes.json();

          setUser(
            userResult.data
          );

          // CHECKIN
          const checkinRes =
            await fetch(
              "/api/checkin"
            );

          const checkinResult =
            await checkinRes.json();

          setCheckins(
            checkinResult.data || []
          );

        } catch (error) {

          console.error(
            error
          );
        }
      };

    fetchData();

  }, []);

  // =====================
  // STATS
  // =====================

  const totalCheckin =
    checkins.length;

  const averageScore =
    totalCheckin > 0
      ? Math.round(
          checkins.reduce(
            (acc, item) =>
              acc +
              (
                item.prediction
                  ?.skorBurnout || 0
              ),
            0
          ) /
            totalCheckin *
            100
        )
      : 0;

  let currentStatus =
    "Low Risk";

  let statusColor =
    "text-green-400";

  let statusBg =
    "bg-green-500/10 border-green-500/20";

  if (averageScore >= 70) {

    currentStatus =
      "High Risk";

    statusColor =
      "text-red-400";

    statusBg =
      "bg-red-500/10 border-red-500/20";

  } else if (
    averageScore >= 40
  ) {

    currentStatus =
      "Medium Risk";

    statusColor =
      "text-yellow-400";

    statusBg =
      "bg-yellow-500/10 border-yellow-500/20";
  }

  return (

    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-white">

          Profile

        </h1>

        <p className="text-gray-400 mt-2">

          Manage your account information

        </p>

      </div>

      {/* PROFILE HERO */}
      <div className="relative overflow-hidden bg-[#111118] border border-[#232336] rounded-3xl p-8 mb-8">

        {/* GLOW */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 blur-3xl rounded-full" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* LEFT */}
          <div className="flex items-center gap-6">

            {/* AVATAR */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">

              {
                user?.nama
                  ?.charAt(0)
                  ?.toUpperCase()
              }

            </div>

            {/* USER INFO */}
            <div>

              <h2 className="text-3xl font-bold text-white">

                {user?.nama}

              </h2>

              <p className="text-gray-400 mt-1">

                {user?.email}

              </p>

              {/* STATUS */}
              <div
                className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border text-sm font-medium ${statusBg} ${statusColor}`}
              >

                ● {currentStatus}

              </div>

            </div>

          </div>

          {/* SCORE */}
          <div className="bg-[#181824] border border-[#2a2a3d] rounded-3xl px-8 py-6 min-w-[220px]">

            <p className="text-gray-400 text-sm mb-2">

              Average Burnout

            </p>

            <h3 className="text-5xl font-bold text-white">

              {averageScore}%

            </h3>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* TOTAL */}
        <div className="bg-[#111118] border border-[#232336] rounded-3xl p-6 hover:border-purple-500/30 transition">

          <p className="text-gray-400 text-sm">

            Total Check-in

          </p>

          <h3 className="text-5xl font-bold text-white mt-4">

            {totalCheckin}

          </h3>

        </div>

        {/* SCORE */}
        <div className="bg-[#111118] border border-[#232336] rounded-3xl p-6 hover:border-purple-500/30 transition">

          <p className="text-gray-400 text-sm">

            Burnout Average

          </p>

          <h3 className="text-5xl font-bold text-yellow-400 mt-4">

            {averageScore}%

          </h3>

        </div>

        {/* STATUS */}
        <div className="bg-[#111118] border border-[#232336] rounded-3xl p-6 hover:border-purple-500/30 transition">

          <p className="text-gray-400 text-sm">

            Current Status

          </p>

          <h3
            className={`text-4xl font-bold mt-4 ${statusColor}`}
          >

            {currentStatus}

          </h3>

        </div>

      </div>

    </div>
  );
}