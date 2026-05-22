import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(
  req: NextRequest
) {

  try {

    const user =
      await getUserFromToken(req);

    if (!user) {

      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const journals =
      await prisma.journalEntry.findMany({

        where: {
          userId: user.id,
        },

        include: {
          prediction: true,
        },

        orderBy: {
          createdAt: "asc",
        },

      });

    const formatted =
      journals.map((item) => ({

        day:
          new Date(
            item.createdAt
          ).toLocaleDateString(
            "id-ID",
            {
              weekday: "short",
            }
          ),

        value:
          Math.round(
            (
              item.prediction
                ?.skorBurnout || 0
            ) * 100
          ),

      }));

    return NextResponse.json({
      status: "success",
      data: formatted,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        status: "error",
        message: "Server error",
      },
      { status: 500 }
    );
  }
}