import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "./HttpError.js";
import { isRecord, isRole } from "./typeGuards.js";
import type { AuthTokenPayload } from "../types/auth.types.js";

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthTokenPayload {
  let decoded: unknown;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }

  if (!isRecord(decoded) || typeof decoded.userId !== "string" || !isRole(decoded.role)) {
    throw new HttpError(401, "Invalid token payload");
  }

  return { userId: decoded.userId, role: decoded.role };
}