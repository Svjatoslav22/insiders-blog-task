import type { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/client.js";
import { HttpError } from "../utils/HttpError.js";
import { verifyToken } from "../utils/jwt.js";

const BEARER_PREFIX = "Bearer ";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader?.startsWith(BEARER_PREFIX)) {
        throw new HttpError(401, "Authentication required");
    }

    const token: string = authHeader.slice(BEARER_PREFIX.length);
    req.user = verifyToken(token);

    next();
}
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
        throw new HttpError(401, "Authentication required");
    }

    if (req.user.role !== Role.ADMIN) {
        throw new HttpError(403, "Access denied: Administrator privileges required");
    }

    next();
}