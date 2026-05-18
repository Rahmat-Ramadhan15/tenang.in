import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, } from "@/lib/utils/apiResponse";
import { getUserFromToken } from "@/lib/auth";

export async function DELETE(req: Request) {
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

    // DELETE PREDICTIONS
    await prisma.prediction.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // DELETE JOURNALS
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

  } catch {

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}