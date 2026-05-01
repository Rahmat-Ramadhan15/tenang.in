export function calculateStreak(history: any[]) {
  if (!history || history.length === 0) return 0;

  const validDates = history
    .filter((item) => item?.createdAt) 
    .map((item) => {
      const d = new Date(item.createdAt);
      return isNaN(d.getTime()) ? null : d;
    })
    .filter((d) => d !== null)
    .map((d) => d!.toISOString().split("T")[0]);

  if (validDates.length === 0) return 0;

  const uniqueDates = [...new Set(validDates)];

  uniqueDates.sort((a, b) => (a > b ? -1 : 1));

  let streak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);

    const diff =
      (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}