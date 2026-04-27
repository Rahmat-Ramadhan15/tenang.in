type Workload = "low" | "medium" | "high";
type Risk = "low" | "medium" | "high";

export function calculateBurnout(sleep: number, workload: Workload) {
  let risk: Risk = "low";
  let score = 30;

  if (sleep < 5 && workload === "high") {
    risk = "high";
    score = 90;
  } else if (sleep < 6) {
    risk = "medium";
    score = 65;
  }

  if (workload === "high") score += 10;
  else if (workload === "medium") score += 5;

  return { risk, score };
}

export function generateInsight(risk: Risk) {
  switch (risk) {
    case "high":
      return "Kondisimu cukup berat. Istirahat dulu.";
    case "medium":
      return "Perlu perhatian. Atur ulang waktu istirahat.";
    default:
      return "Kondisi kamu stabil";
  }
}