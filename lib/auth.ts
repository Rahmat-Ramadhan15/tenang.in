import { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "./jwt";

type UserPayload = JwtPayload & {
  id: string;
  email: string;
};

export function getUserFromToken(
  req: NextRequest
): UserPayload | null {

  try {

    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return null;
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    const decoded =
      verifyToken(token) as UserPayload;

    return decoded;

  } catch {

    return null;
  }
}