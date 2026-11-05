import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";

interface HealthResponse {
  status: "ok";
  timestamp: string;
}

export const app: Express = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response<HealthResponse>): void => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);