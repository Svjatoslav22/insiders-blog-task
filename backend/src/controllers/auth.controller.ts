import type { Request, Response } from "express";
import { validateRegisterBody } from "../validators/auth.validator.js";
import { registerUser } from "../services/auth.service.js";
import type { RegisterResponse } from "../types/auth.types.js";

export async function register(
  req: Request<Record<string, string>, RegisterResponse, unknown>,
  res: Response<RegisterResponse>,
): Promise<void> {
  const input = validateRegisterBody(req.body);
  const user = await registerUser(input);

  res.status(201).json({ user });
}