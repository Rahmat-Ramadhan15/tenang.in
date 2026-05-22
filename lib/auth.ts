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

    // GET TOKEN FROM COOKIE
    const token =
      req.cookies.get(
        "authToken"
      )?.value;

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

    // SESSION NOT FOUND
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