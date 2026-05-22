import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  request: NextRequest
) {
  try {

    // AMBIL TOKEN DARI COOKIE
    const token =
      request.cookies.get(
        "authToken"
      )?.value;

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

    // VALIDASI TOKEN
    try {
      verifyToken(token);
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

    // HAPUS SESSION
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });

    // RESPONSE
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

    // HAPUS COOKIE
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
        message:
          "Server error",
        data: null,
      },
      { status: 500 }
    );
  }
}