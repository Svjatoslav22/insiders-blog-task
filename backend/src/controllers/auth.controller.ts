import type { Request, Response } from "express";
import { validateLoginBody, validateRegisterBody } from "../validators/auth.validator.js";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service.js";
import { HttpError } from "../utils/HttpError.js";
import type { AuthResponse, UserResponse } from "../types/auth.types.js";

type AuthRequest = Request<Record<string, string>, AuthResponse, unknown>;

export async function register(req: AuthRequest, res: Response<AuthResponse>): Promise<void> {
  const input = validateRegisterBody(req.body);
  const result = await registerUser(input);

  res.status(201).json(result);
}

export async function login(req: AuthRequest, res: Response<AuthResponse>): Promise<void> {
  const input = validateLoginBody(req.body);
  const result = await loginUser(input);

  res.status(200).json(result);
}

export async function me(req: Request, res: Response<UserResponse>): Promise<void> {
  if (!req.user) {
    throw new HttpError(401, "Authentication required");
  }

  const user = await getCurrentUser(req.user.userId);

  res.status(200).json({ user });
}