import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nama,
      email,
      password,
    } = body;

    // VALIDASI
    if (
      !nama ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "Semua field wajib diisi",
        },
        { status: 400 }
      );
    }

    // EMAIL SUDAH ADA
    const existing =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existing) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email sudah digunakan",
        },
        { status: 400 }
      );
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
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
        },
      },
      { status: 201 }
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