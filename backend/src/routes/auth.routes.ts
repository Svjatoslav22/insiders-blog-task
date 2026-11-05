import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

export const authRouter: Router = Router();

authRouter.post("/register", register);