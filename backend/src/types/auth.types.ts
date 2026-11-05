import type { User } from "../generated/prisma/client.js";

export type PublicUser = Omit<User, "password">;

export interface RegisterInput {
  email: string;
  password: string;
  name: string | null;
}

export interface RegisterResponse {
  user: PublicUser;
}

export interface ApiErrorResponse {
  message: string;
}