import { NextResponse } from "next/server";
import { calculateBurnout, generateInsight, } from "@/lib/services/checkinService";
import { checkinSchema } from "@/lib/validations/checkinSchema";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rateLimiter";
import { success, error, } from "@/lib/utils/apiResponse";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {

    // AUTH
    const user =
      getUserFromToken(req as any);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    // GET USER JOURNALS
    const journals =
      await prisma.journalEntry.findMany({
        where: {
          userId: user.id,
        },

        include: {
          prediction: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      success(
        journals,
        "Berhasil ambil semua data"
      )
    );

  } catch (err) {

    logger.error("Get journals error", {
      error:
        err instanceof Error
          ? err.message
          : err,
    });

    return NextResponse.json(
      error("Gagal ambil data"),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {

    const ip =
      req.headers
        .get("x-forwarded-for")
        ?.split(",")[0] || "local";

    // RATE LIMIT
    if (!rateLimit(ip)) {
      return NextResponse.json(
        error("Too many requests"),
        { status: 429 }
      );
    }

    // AUTH
    const user =
      getUserFromToken(req as any);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    // PARSE BODY
    let body;

    try {
      body = await req.json();

    } catch {
      return NextResponse.json(
        error("Invalid JSON"),
        { status: 400 }
      );
    }

    // VALIDATION
    const parsed =
      checkinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        error(
          parsed.error.issues[0]?.message ||
          "Invalid input"
        ),
        { status: 400 }
      );
    }

    const {
      journal: journalText,
      sleep,
      workload,
      mood,
    } = parsed.data;

    const todayStart = new Date();

    todayStart.setHours(
      0,
      0,
      0,
      0
    );

    const todayEnd = new Date();

    todayEnd.setHours(
      23,
      59,
      59,
      999
    );

    const already =
      await prisma.journalEntry.findFirst({
        where: {
          userId: user.id,

          tanggal: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

    if (already) {
      return NextResponse.json(
        error(
          "Kamu sudah check-in hari ini"
        ),
        { status: 400 }
      );
    }

    const { risk, score } =
      calculateBurnout(
        sleep,
        workload
      );

    const insight =
      generateInsight(risk);

    const createdJournal =
      await prisma.journalEntry.create({
        data: {
          userId: user.id,

          tanggal: new Date(),

          teksJurnal: journalText,

          jamTidur: sleep,

          bebanKerja: String(workload),

          mood: String(mood),
        },
      });

    const createdPrediction =
      await prisma.prediction.create({
        data: {
          userId: user.id,

          journalId:
            createdJournal.id,

          // MOCK PROBABILITIES
          probAnger: 0.2,
          probFear: 0.3,
          probSadness: 0.5,
          probJoy: 0.1,
          probDisgust: 0.1,
          probTrust: 0.4,
          probAnticipation: 0.2,

          skorBurnout:
            score / 100,

          labelRisk: risk,
        },
      });

    const responseData = {
      journal: createdJournal,

      prediction: {
        ...createdPrediction,
        insight,
      },
    };

    logger.info("Checkin created", {
      id: createdJournal.id,
      ip,
    });

    return NextResponse.json(
      success(
        responseData,
        "Check-in berhasil"
      ),
      { status: 201 }
    );

  } catch (err) {

    logger.error("Checkin error", {
      error:
        err instanceof Error
          ? err.message
          : err,
    });

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}