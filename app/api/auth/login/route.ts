import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const {
      email,
      password,
    } = body;

    // VALIDASI
    if (
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email dan password wajib",
        },
        { status: 400 }
      );
    }

    // CEK USER
    const user =
      await prisma.user.findUnique({
        where: { email },
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

    // PASSWORD NULL
    if (!user.password) {
      return NextResponse.json(
        {
          status: "error",
          message: "Password user tidak valid",
        },
        { status: 400 }
      );
    }

    // CEK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return NextResponse.json(
        {
          status: "error",
          message: "Password salah",
        },
        { status: 401 }
      );
    }

    // JWT
    const token = signToken({
      id: user.id,
      email: user.email,
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Login berhasil",
        data: {
          token,
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
          },
        },
      },
      { status: 200 }
    );

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        status: "error",
        message: "Server error",
      },
      { status: 500 }
    );
  }
}