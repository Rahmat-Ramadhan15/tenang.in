"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ResultData = {
  id: string;

  tanggal: string;

  teksJurnal: string;

  jamTidur: number;

  bebanKerja: string;

  mood: string;

  createdAt: string;

  prediction: {
    skorBurnout: number;

    labelRisk:
      | "low"
      | "medium"
      | "high";
  };
};

export default function ResultPage() {

  const params =
    useParams();

  const [data, setData] =
    useState<ResultData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchDetail =
      async () => {

        try {

          const res =
            await fetch(
              `/api/checkin/${params.id}`
            );

          const result =
            await res.json();

          setData(result.data);

        } catch (error) {

          console.error(
            "FETCH RESULT ERROR",
            error
          );

        } finally {

          setLoading(false);

        }
      };

    fetchDetail();

  }, [params.id]);

  if (loading) {
    return (
      <div className="text-white">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-white">
        Result tidak ditemukan
      </div>
    );
  }

  const score =
    Math.round(
      (data.prediction
        ?.skorBurnout || 0) * 100
    );

  const risk =
    data.prediction
      ?.labelRisk || "low";

  const getRiskColor = () => {

    if (risk === "high") {
      return "text-red-500";
    }

    if (risk === "medium") {
      return "text-yellow-400";
    }

    return "text-green-400";
  };

  const getRiskBg = () => {

    if (risk === "high") {
      return "bg-red-500/10 border-red-500/20";
    }

    if (risk === "medium") {
      return "bg-yellow-500/10 border-yellow-500/20";
    }

    return "bg-green-500/10 border-green-500/20";
  };

  const getInsight = () => {

    if (risk === "high") {
      return "Kondisimu cukup berat. Istirahat dan kurangi tekanan kerja.";
    }

    if (risk === "medium") {
      return "Mulai jaga pola tidur dan atur aktivitas harian.";
    }

    return "Kondisimu cukup baik. Pertahankan pola hidup sehat.";
  };

  const getRecommendation =
    () => {

      if (risk === "high") {
        return [
          "Tidur minimal 7 jam",
          "Kurangi beban kerja",
          "Luangkan waktu istirahat",
        ];
      }

      if (risk === "medium") {
        return [
          "Atur waktu tidur",
          "Kurangi overthinking",
          "Lakukan relaksasi ringan",
        ];
      }

      return [
        "Pertahankan pola sehat",
        "Jaga konsistensi tidur",
        "Lanjutkan check-in harian",
      ];
    };

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Hasil Analisis
      </h1>

      {/* MAIN CARD */}
      <div className="bg-[#1a1a22] border border-gray-800 rounded-3xl p-8 mb-8">

        <div className="flex justify-between items-center">

          {/* LEFT */}
          <div>

            <div
              className={`inline-flex items-center px-4 py-2 rounded-xl border text-sm font-bold uppercase mb-5 ${getRiskBg()} ${getRiskColor()}`}
            >
              {risk} risk
            </div>

            <h2 className="text-7xl font-bold mb-2">
              {score}%
            </h2>

            <p className="text-gray-400">
              Burnout Score
            </p>

          </div>

          {/* RIGHT */}
          <div className="relative w-44 h-44">

            <svg className="transform -rotate-90 w-44 h-44">

              <circle
                cx="88"
                cy="88"
                r="70"
                stroke="#2a2a35"
                strokeWidth="14"
                fill="none"
              />

              <circle
                cx="88"
                cy="88"
                r="70"
                stroke={
                  risk === "high"
                    ? "#ef4444"
                    : risk === "medium"
                    ? "#f59e0b"
                    : "#10b981"
                }
                strokeWidth="14"
                fill="none"
                strokeDasharray={
                  2 * Math.PI * 70
                }
                strokeDashoffset={
                  2 *
                    Math.PI *
                    70 -
                  (score / 100) *
                    (2 *
                      Math.PI *
                      70)
                }
                strokeLinecap="round"
              />

            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
              {score}%
            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-5 mb-8">

        <div className="bg-[#1a1a22] border border-gray-800 p-5 rounded-2xl">

          <p className="text-gray-400 text-sm mb-2">
            Mood
          </p>

          <h3 className="text-2xl font-bold capitalize">
            {data.mood}
          </h3>

        </div>

        <div className="bg-[#1a1a22] border border-gray-800 p-5 rounded-2xl">

          <p className="text-gray-400 text-sm mb-2">
            Tidur
          </p>

          <h3 className="text-2xl font-bold">
            {data.jamTidur} jam
          </h3>

        </div>

        <div className="bg-[#1a1a22] border border-gray-800 p-5 rounded-2xl">

          <p className="text-gray-400 text-sm mb-2">
            Workload
          </p>

          <h3 className="text-2xl font-bold capitalize">
            {data.bebanKerja}
          </h3>

        </div>

      </div>

      {/* INSIGHT */}
      <div className="bg-[#1a1a22] border border-gray-800 rounded-2xl p-6 mb-8">

        <h3 className="text-xl font-bold mb-4">
          Penjelasan
        </h3>

        <p className="text-gray-300 leading-8">
          {getInsight()}
        </p>

      </div>

      {/* RECOMMENDATION */}
      <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 mb-8">

        <h3 className="text-xl font-bold mb-5">
          Rekomendasi
        </h3>

        <div className="space-y-4">

          {getRecommendation().map(
            (item, index) => (
              <div
                key={index}
                className="bg-[#111118] border border-gray-800 rounded-xl p-4"
              >
                {item}
              </div>
            )
          )}

        </div>

      </div>

      {/* JOURNAL */}
      <div className="bg-[#1a1a22] border border-gray-800 rounded-2xl p-6 mb-8">

        <h3 className="text-xl font-bold mb-4">
          Journal
        </h3>

        <p className="text-gray-300 whitespace-pre-line">
          {data.teksJurnal}
        </p>

      </div>

      {/* BUTTON */}
      <div className="grid grid-cols-2 gap-4">

        <Link
          href="/dashboard"
          className="bg-[#2a2a35] hover:bg-[#333] transition p-4 rounded-xl text-center font-semibold"
        >
          Dashboard
        </Link>

        <Link
          href="/history"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition p-4 rounded-xl text-center font-semibold"
        >
          History
        </Link>

      </div>

    </div>
  );
}