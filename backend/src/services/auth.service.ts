import type { Prisma, User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/HttpError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import type { AuthResponse, LoginInput, PublicUser, RegisterInput } from "../types/auth.types.js";

export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function buildAuthResponse(user: PublicUser): AuthResponse {
  const token: string = signToken({ userId: user.id, role: user.role });
  return { token, user };
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new HttpError(409, "User with this email already exists");
  }

  const hashedPassword: string = await hashPassword(input.password);

  const user: PublicUser = await prisma.user.create({
    data: { email: input.email, password: hashedPassword, name: input.name },
    select: publicUserSelect,
  });

  return buildAuthResponse(user);
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const user: User | null = await prisma.user.findUnique({ where: { email: input.email } });

  // Однакове повідомлення для обох випадків — не розкриваємо, чи існує email
  const INVALID_CREDENTIALS = "Invalid email or password";

  if (!user) {
    throw new HttpError(401, INVALID_CREDENTIALS);
  }

  const isPasswordValid: boolean = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, INVALID_CREDENTIALS);
  }

  return buildAuthResponse(toPublicUser(user));
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user: PublicUser | null = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return user;
}