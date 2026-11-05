import { Role } from "../generated/prisma/client.js";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isRole(value: unknown): value is Role {
  return value === Role.USER || value === Role.ADMIN;
}