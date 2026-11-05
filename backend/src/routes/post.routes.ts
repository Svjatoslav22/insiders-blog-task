import { Router } from "express";
import {
  getPosts,
  getPost,
  handleCreatePost,
  handleUpdatePost,
  handleDeletePost,
} from "../controllers/post.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

export const postRouter: Router = Router();

postRouter.get("/", getPosts);
postRouter.get("/:id", getPost);

postRouter.post("/", authenticate, requireAdmin, handleCreatePost);
postRouter.put("/:id", authenticate, requireAdmin, handleUpdatePost);
postRouter.delete("/:id", authenticate, requireAdmin, handleDeletePost);