import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

async function bootstrap(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connected");

    app.listen(env.port, (): void => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
    });
  } catch (error: unknown) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void bootstrap();