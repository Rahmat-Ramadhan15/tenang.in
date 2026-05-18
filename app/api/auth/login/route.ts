import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(
  req: NextRequest
) {
  try {

    // PARSE BODY
    const body =
      await req.json();

    let {
      email,
      password,
    } = body;

    // VALIDATION
    if (
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Email dan password wajib diisi",
          data: null,
        },
        { status: 400 }
      );
    }

    // SANITIZE
    email =
      email
        .trim()
        .toLowerCase();

    password =
      password.trim();

    // FIND USER
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Email atau password salah",
          data: null,
        },
        { status: 401 }
      );
    }

    // CHECK PASSWORD NULL
    if (!user.password) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Password tidak valid",
          data: null,
        },
        { status: 400 }
      );
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Email atau password salah",
          data: null,
        },
        { status: 401 }
      );
    }

    // DELETE OLD SESSION
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // GENERATE TOKEN
    const token =
      signToken({
        id: user.id,
        email: user.email,
      });

    // EXPIRED 7 DAYS
    const expiresAt =
      new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    // SAVE SESSION
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // RESPONSE
    const response =
      NextResponse.json(
        {
          status: "success",
          message:
            "Login berhasil",
          data: {
            token,

            user: {
              id: user.id,
              nama: user.nama,
              email:
                user.email,
            },
          },
        },
        { status: 200 }
      );

    // SET COOKIE
    response.cookies.set(
      "authToken",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          "strict",

        maxAge:
          60 *
          60 *
          24 *
          7,

        path: "/",
      }
    );

    return response;

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
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