import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {

    // WAJIB AWAIT
    const { id } =
      await params;

    if (!id) {
      return NextResponse.json(
        {
          status: "error",
          message: "ID wajib diisi",
        },
        { status: 400 }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          nama: true,
          email: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "User tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        data: user,
      },
      { status: 200 }
    );

  } catch (err) {

    console.error(
      "GET USER ERROR",
      err
    );

    return NextResponse.json(
      {
        status: "error",
        message: "Server error",
      },
      { status: 500 }
    );
  }
}