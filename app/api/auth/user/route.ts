import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: NextRequest
) {
  try {

    // AMBIL TOKEN DARI COOKIE
    const token =
      req.cookies.get("authToken")
        ?.value;

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Token tidak ditemukan",
          data: null,
        },
        { status: 401 }
      );
    }

    let decoded;

    try {
      decoded = verifyToken(token) as {
        id: string;
        email: string;
      };
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Token tidak valid",
          data: null,
        },
        { status: 401 }
      );
    }

    // CEK SESSION
    const session =
      await prisma.session.findUnique({
        where: {
          token,
        },
      });

    if (!session) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Session tidak ditemukan",
          data: null,
        },
        { status: 401 }
      );
    }

    // CEK EXPIRED
    if (
      new Date() >
      session.expiresAt
    ) {

      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return NextResponse.json(
        {
          status: "error",
          message:
            "Session expired",
          data: null,
        },
        { status: 401 }
      );
    }

    // AMBIL USER
    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          nama: true,
          email: true,
          createdAt: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "User tidak ditemukan",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message:
          "Berhasil mengambil profile",
        data: user,
      },
      { status: 200 }
    );

  } catch (error) {

    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        status: "error",
        message: "Server error",
        data: null,
      },
      { status: 500 }
    );
  }
}