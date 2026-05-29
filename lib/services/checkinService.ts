export type Workload = "very_low" | "low" | "medium" | "high" | "very_high";
export type Mood = "sad" | "bad" | "neutral" | "good" | "excellent";
export type Risk = "low" | "medium" | "high";

export function calculateBurnout(
  sleep: number,
  workload: Workload,
  mood: Mood,
  sadness: number
) {
  let score = 0;

  // Tidur (Max 25 pts) - Pola tidur yang buruk adalah indikator utama
  if (sleep <= 4) score += 25;
  else if (sleep <= 5) score += 15;
  else if (sleep <= 6) score += 10;
  else if (sleep >= 8) score -= 5;

  const workloadMap: Record<Workload, number> = { 
    "very_low": 0, "low": 5, "medium": 10, "high": 15, "very_high": 20 
  };
  score += workloadMap[workload];

  // Mood (Max 30 pts)
  const moodMap: Record<Mood, number> = { 
    "sad": 30, "bad": 20, "neutral": 10, "good": 0, "excellent": -5 
  };
  score += moodMap[mood];

  // AI Analysis (Max 25 pts) - Memberikan bobot tambahan pada analisis teks
  if (sadness >= 0.8) score += 25;
  else if (sadness >= 0.5) score += 15;
  else if (sadness >= 0.3) score += 5;

  // Normalisasi skor antara 0 - 100
  score = Math.min(100, Math.max(0, score));

  // < 35: Low | 35-65: Medium | > 65: High
  let risk: Risk = "low";
  if (score > 65) risk = "high";
  else if (score >= 35) risk = "medium";

  return { risk, score };
}

export function generateInsight(risk: Risk) {
  switch (risk) {
    case "high":
      return "Kondisimu cukup berat. Segera istirahat dan kurangi tekanan.";
    case "medium":
      return "Kamu mulai mengalami tekanan mental. Coba atur pola hidup.";
    default:
      return "Kondisimu cukup baik. Pertahankan pola hidup sehat.";
  }
}