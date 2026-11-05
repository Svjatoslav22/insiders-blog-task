import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../config/env.js";

const adapter: PrismaPg = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma: PrismaClient = new PrismaClient({ adapter });