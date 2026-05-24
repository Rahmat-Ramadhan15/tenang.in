import { z } from "zod";

export const checkinSchema = z.object({
  journal: z.string().min(1, "Journal wajib diisi"),

  sleep: z.number().min(0).max(24),

  workload: z.enum([
    "very_low",
    "low",
    "medium",
    "high",
    "very_high",
  ]),

  mood: z.enum([
    "sad",
    "bad",
    "neutral",
    "good",
    "excellent",
  ]),
});