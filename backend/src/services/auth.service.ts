import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/HttpError.js";
import { hashPassword } from "../utils/password.js";
import type { PublicUser, RegisterInput } from "../types/auth.types.js";

export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new HttpError(409, "User with this email already exists");
  }

  const hashedPassword: string = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
    },
    select: publicUserSelect,
  });
}