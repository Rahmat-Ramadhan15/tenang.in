import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  request: NextRequest
) {
  try {
    const authHeader =
      request.headers.get(
        "authorization"
      );

    const token =
      authHeader?.replace(
        "Bearer ",
        ""
      );

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

    try {
      verifyToken(token);
    } catch {
      return NextResponse.json(
        {
          status: "error",
          message: "Token tidak valid",
          data: null,
        },
        { status: 401 }
      );
    }

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
            "Session sudah expired",
          data: null,
        },
        { status: 401 }
      );
    }

    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    const response =
      NextResponse.json(
        {
          status: "success",
          message:
            "Logout berhasil",
          data: null,
        },
        { status: 200 }
      );

    response.cookies.set(
      "authToken",
      "",
      {
        maxAge: 0,
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        path: "/",
      }
    );

    return response;

  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
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