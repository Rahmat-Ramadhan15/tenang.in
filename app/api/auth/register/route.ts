import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();

    let { nama, email, password } = body;

    if (!nama || !email || !password) {
      return NextResponse.json(
        {
          status: "error",
          message: "Semua field wajib diisi",
          data: null,
        },
        { status: 400 }
      );
    }

    nama = nama.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (nama.length < 3) {
      return NextResponse.json(
        {
          status: "error",
          message: "Nama minimal 3 karakter",
          data: null,
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Format email tidak valid",
          data: null,
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Password minimal 6 karakter",
          data: null,
        },
        { status: 400 }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Email sudah digunakan",
          data: null,
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await prisma.user.create({
        data: {
          nama,
          email,
          password: hashedPassword,
        },
      });

    return NextResponse.json(
      {
        status: "success",
        message: "Register berhasil",
        data: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "REGISTER ERROR:",
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