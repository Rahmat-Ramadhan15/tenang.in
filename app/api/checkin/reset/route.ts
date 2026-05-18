import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { success, error, } from "@/lib/utils/apiResponse";

export async function DELETE(
  req: NextRequest
) {
  try {
    // AUTH
    const user =
      await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    // DELETE ALL USER PREDICTIONS
    await prisma.prediction.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // DELETE ALL USER JOURNALS
    await prisma.journalEntry.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(
      success(
        null,
        "Semua history berhasil dihapus"
      )
    );

  } catch (err) {
    console.error(
      "DELETE HISTORY ERROR",
      err
    );

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}