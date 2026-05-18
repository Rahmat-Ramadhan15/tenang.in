import { NextRequest, NextResponse, } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBurnout, generateInsight, } from "@/lib/services/checkinService";
import { checkinSchema } from "@/lib/validations/checkinSchema";
import { success, error, } from "@/lib/utils/apiResponse";
import { getUserFromToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    // AUTH
    const user =
      await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    // GET DETAIL
    const item =
      await prisma.journalEntry.findFirst({
        where: {
          id,
          userId: user.id,
        },

        include: {
          prediction: true,
        },
      });

    if (!item) {
      return NextResponse.json(
        error("Data tidak ditemukan"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      success(
        item,
        "Berhasil ambil detail"
      )
    );

  } catch (err) {
    console.error(
      "GET DETAIL ERROR",
      err
    );

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    // AUTH
    const user =
      await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    // PARSE BODY
    let body;

    try {
      body =
        await req.json();

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
          parsed.error
            .issues[0]?.message ||
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

    // CHECK EXISTING
    const existing =
      await prisma.journalEntry.findFirst({
        where: {
          id,
          userId: user.id,
        },

        include: {
          prediction: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        error("Data tidak ditemukan"),
        { status: 404 }
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
        async (tx) => {

          // UPDATE JOURNAL
          const updatedJournal =
            await tx.journalEntry.update({
              where: {
                id,
              },

              data: {
                teksJurnal:
                  journalText,

                jamTidur:
                  sleep,

                bebanKerja:
                  String(workload),

                mood:
                  String(mood),
              },
            });

          // UPDATE / CREATE PREDICTION
          let updatedPrediction;

          if (existing.prediction) {

            updatedPrediction =
              await tx.prediction.update({
                where: {
                  journalId: id,
                },

                data: {
                  skorBurnout:
                    score / 100,

                  labelRisk:
                    risk,

                  probAnger: 0.2,
                  probFear: 0.3,
                  probSadness: 0.5,
                  probJoy: 0.1,
                  probDisgust: 0.1,
                  probTrust: 0.4,
                  probAnticipation: 0.2,
                },
              });

          } else {

            updatedPrediction =
              await tx.prediction.create({
                data: {
                  userId:
                    user.id,

                  journalId:
                    id,

                  probAnger: 0.2,
                  probFear: 0.3,
                  probSadness: 0.5,
                  probJoy: 0.1,
                  probDisgust: 0.1,
                  probTrust: 0.4,
                  probAnticipation: 0.2,

                  skorBurnout:
                    score / 100,

                  labelRisk:
                    risk,
                },
              });
          }

          return {
            journal:
              updatedJournal,

            prediction: {
              ...updatedPrediction,
              insight,
            },
          };
        }
      );

    return NextResponse.json(
      success(
        result,
        "Berhasil update check-in"
      )
    );

  } catch (err) {
    console.error(
      "UPDATE ERROR",
      err
    );

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    // AUTH
    const user =
      await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    // CHECK DATA
    const item =
      await prisma.journalEntry.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!item) {
      return NextResponse.json(
        error("Data tidak ditemukan"),
        { status: 404 }
      );
    }

    // DELETE
    await prisma.journalEntry.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      success(
        item,
        "Berhasil dihapus"
      )
    );

  } catch (err) {
    console.error(
      "DELETE ERROR",
      err
    );

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}