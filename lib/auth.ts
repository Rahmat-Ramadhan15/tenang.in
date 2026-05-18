import { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "./jwt";
import { prisma } from "./prisma";

type UserPayload = JwtPayload & {
  id: string;
  email: string;
};

export async function getUserFromToken(
  req: NextRequest
): Promise<UserPayload | null> {

  try {

    // GET AUTH HEADER
    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return null;
    }

    // GET TOKEN
    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    // VERIFY JWT
    const decoded =
      verifyToken(token) as UserPayload;

    // CHECK SESSION DATABASE
    const session =
      await prisma.session.findUnique({
        where: {
          token,
        },
      });

    // SESSION TIDAK ADA
    if (!session) {
      return null;
    }

    // SESSION EXPIRED
    if (
      new Date() >
      session.expiresAt
    ) {

      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return null;
    }

    return decoded;

  } catch {

    return null;
  }
}