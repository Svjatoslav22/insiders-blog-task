import { HttpError } from "../utils/HttpError.js";
import type { LoginInput, RegisterInput } from "../types/auth.types.js";
import { isRecord } from "../utils/typeGuards.js";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_NAME_LENGTH = 50;


export function validateRegisterBody(body: unknown): RegisterInput {
  if (!isRecord(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }

  const { email, password, name } = body;

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    throw new HttpError(400, "A valid email is required");
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (name !== undefined && typeof name !== "string") {
    throw new HttpError(400, "Name must be a string");
  }

  const trimmedName: string = name?.trim() ?? "";

  if (trimmedName.length > MAX_NAME_LENGTH) {
    throw new HttpError(400, `Name must be at most ${MAX_NAME_LENGTH} characters`);
  }

  return {
    email: email.trim().toLowerCase(),
    password,
    name: trimmedName.length > 0 ? trimmedName : null,
  };
}
export function validateLoginBody(body: unknown): LoginInput {
  if (!isRecord(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }

  const { email, password } = body;

  if (typeof email !== "string" || email.trim().length === 0) {
    throw new HttpError(400, "Email is required");
  }

  if (typeof password !== "string" || password.length === 0) {
    throw new HttpError(400, "Password is required");
  }

  return { email: email.trim().toLowerCase(), password };
}