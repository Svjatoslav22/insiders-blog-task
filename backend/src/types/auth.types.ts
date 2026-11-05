import type { Role, User } from "../generated/prisma/client.js";

export type PublicUser = Omit<User, "password">;

export interface RegisterInput {
  email: string;
  password: string;
  name: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface UserResponse {
  user: PublicUser;
}

export interface ApiErrorResponse {
  message: string;
}