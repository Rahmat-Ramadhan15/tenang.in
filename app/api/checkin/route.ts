import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { checkinSchema } from "@/lib/validations/checkinSchema";
import { calculateBurnout, generateInsight, } from "@/lib/services/checkinService";
import { success, error, } from "@/lib/utils/apiResponse";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // AUTH
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    // GET JOURNALS
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
    logger.error("GET JOURNALS ERROR", {
      error:
        err instanceof Error
          ? err.message
          : String(err),
    });

    return NextResponse.json(
      error("Gagal ambil data"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // GET IP
    const ip =
      req.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim() || "local";

    // RATE LIMIT
    if (!rateLimit(ip)) {
      return NextResponse.json(
        error("Too many requests"),
        { status: 429 }
      );
    }

    // AUTH
    const user = await getUserFromToken(req);

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

    // EXTRACT DATA
    const {
      journal: journalText,
      sleep,
      workload,
      mood,
    } = parsed.data;

    // TODAY RANGE
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // CHECK TODAY CHECK-IN
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
        error("Kamu sudah check-in hari ini"),
        { status: 400 }
      );
    }

    // MOCK AI
    const { risk, score } =
      calculateBurnout(
        sleep,
        workload
      );

    const insight =
      generateInsight(risk);

    // TRANSACTION
    const result =
      await prisma.$transaction(
        async (tx: any) => {

          // CREATE JOURNAL
          const createdJournal =
            await tx.journalEntry.create({
              data: {
                userId: user.id,
                tanggal: new Date(),
                teksJurnal: journalText,
                jamTidur: sleep,
                bebanKerja: String(workload),
                mood: String(mood),
              },
            });

          // CREATE PREDICTION
          const createdPrediction =
            await tx.prediction.create({
              data: {
                userId: user.id,
                journalId:
                  createdJournal.id,

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

          return {
            journal: createdJournal,

            prediction: {
              ...createdPrediction,
              insight,
            },
          };
        }
      );

    logger.info("CHECKIN CREATED", {
      userId: user.id,
      ip,
    });

    return NextResponse.json(
      success(
        result,
        "Check-in berhasil"
      ),
      { status: 201 }
    );

  } catch (err) {
    logger.error("CHECKIN ERROR", {
      error:
        err instanceof Error
          ? err.message
          : String(err),
    });

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}