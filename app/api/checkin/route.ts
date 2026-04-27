import { NextResponse } from "next/server";
import { history } from "@/lib/store";
import { calculateBurnout, generateInsight,} from "@/lib/services/checkinService";
import { checkinSchema } from "@/lib/validations/checkinSchema";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rateLimiter";
import { success, error } from "@/lib/utils/apiResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sorted = [...history].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return NextResponse.json(
    success(sorted, "Berhasil ambil semua data")
  );
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "local";

    // RATE LIMIT
    if (!rateLimit(ip)) {
      return NextResponse.json(error("Too many requests"), {
        status: 429,
      });
    }

    // PARSE
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(error("Invalid JSON"), {
        status: 400,
      });
    }

    // VALIDASI
    const parsed = checkinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        error(parsed.error.issues[0]?.message || "Invalid input"),
        { status: 400 }
      );
    }

    const { journal, sleep, workload, mood } = parsed.data;

    // LIMIT 1 HARI
    const today = new Date().toDateString();

    const already = history.find(
      (item) =>
        item.createdAt &&
        new Date(item.createdAt).toDateString() === today
    );

    if (already) {
      return NextResponse.json(
        error("Kamu sudah check-in hari ini"),
        { status: 400 }
      );
    }

    // LOGIC
    const { risk, score } = calculateBurnout(sleep, workload);
    const insight = generateInsight(risk);

    const newData = {
      id: Date.now().toString(),
      journal,
      sleep,
      workload,
      mood,
      burnout: {
        score,
        risk,
        insight,
      },
      createdAt: new Date().toISOString(),
    };

    // SIMPAN
    history.push(newData);

    // LIMIT 10 DATA
    if (history.length > 10) {
      history.shift();
    }

    logger.info("Checkin created", {
      id: newData.id,
      ip,
    });

    return NextResponse.json(
      success(newData, "Check-in berhasil"),
      { status: 201 }
    );

  } catch (err) {
    logger.error("Checkin error", {
      error: err instanceof Error ? err.message : err,
    });

    return NextResponse.json(error("Server error"), {
      status: 500,
    });
  }
}