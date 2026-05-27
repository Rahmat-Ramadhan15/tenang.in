export type Workload = "very_low" | "low" | "medium" | "high" | "very_high";
export type Mood = "sad" | "bad" | "neutral" | "good" | "excellent";
export type Risk = "low" | "medium" | "high";

/**
 * Menghitung skor burnout berdasarkan input user dan probabilitas AI.
 */
export function calculateBurnout(
  sleep: number,
  workload: Workload,
  mood: Mood,
  sadness: number
) {
  let score = 20;

  if (sleep <= 3) score += 35;
  else if (sleep <= 5) score += 25;
  else if (sleep <= 6) score += 15;
  else if (sleep >= 8) score -= 5;

  let workloadValue = 1;
  switch (workload) {
    case "very_low":
      workloadValue = 1;
      break;
    case "low":
      workloadValue = 2;
      break;
    case "medium":
      workloadValue = 3;
      break;
    case "high":
      workloadValue = 4;
      break;
    case "very_high":
      workloadValue = 5;
      break;
  }
  score += workloadValue * 5;

  let moodValue = 3;
  switch (mood) {
    case "sad":       moodValue = 1; break;
    case "bad":       moodValue = 2; break;
    case "neutral":   moodValue = 3; break;
    case "good":      moodValue = 4; break;
    case "excellent": moodValue = 5; break;
  }
 
  if (moodValue === 1) score += 30;
  else if (moodValue === 2) score += 20;
  else if (moodValue === 3) score += 5;
  else if (moodValue === 4) score -= 5;
  else if (moodValue === 5) score -= 10;

  if (sadness >= 0.8) score += 30;
  else if (sadness >= 0.5) score += 15;

  score = Math.min(100, Math.max(0, score));

  let risk: Risk = "low";
  if (score >= 75) risk = "high";
  else if (score >= 45) risk = "medium";

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