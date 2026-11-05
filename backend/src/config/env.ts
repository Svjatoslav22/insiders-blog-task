import "dotenv/config";

interface EnvConfig {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  clientUrl: string;
}

function getRequiredEnv(name: string): string {
  const value: string | undefined = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export const env: EnvConfig = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
};