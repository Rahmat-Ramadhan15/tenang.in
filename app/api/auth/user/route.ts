import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {

    // AMBIL HEADER
    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          status: "error",
          message: "Token tidak ada",
        },
        { status: 401 }
      );
    }

    // AMBIL TOKEN
    const token =
      authHeader.split(" ")[1];

    // VERIFY JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      email: string;
    };

    // CARI USER
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
          message: "User tidak ditemukan",
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

    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message: "Token tidak valid",
      },
      { status: 401 }
    );
  }
}