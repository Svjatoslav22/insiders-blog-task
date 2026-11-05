import type { Request, Response } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../services/post.service.js";
import {
  validateCreatePostBody,
  validateUpdatePostBody,
} from "../validators/post.validator.js";
import { HttpError } from "../utils/HttpError.js";
import type {
  DeletePostResponse,
  PostListResponse,
  PostResponse,
} from "../types/post.types.js";

export async function getPosts(
  _req: Request,
  res: Response<PostListResponse>,
): Promise<void> {
  const posts = await getAllPosts();
  res.status(200).json({ posts });
}

export async function getPost(
  req: Request<{ id: string }>,
  res: Response<PostResponse>,
): Promise<void> {
  const { id } = req.params;
  const post = await getPostById(id);
  res.status(200).json({ post });
}

export async function handleCreatePost(
  req: Request<Record<string, string>, PostResponse, unknown>,
  res: Response<PostResponse>,
): Promise<void> {
  if (!req.user) {
    throw new HttpError(401, "Authentication required");
  }

  const input = validateCreatePostBody(req.body);
  const post = await createPost(input, req.user.userId);

  res.status(201).json({ post });
}

export async function handleUpdatePost(
  req: Request<{ id: string }, PostResponse, unknown>,
  res: Response<PostResponse>,
): Promise<void> {
  const { id } = req.params;
  const input = validateUpdatePostBody(req.body);
  const post = await updatePost(id, input);

  res.status(200).json({ post });
}

export async function handleDeletePost(
  req: Request<{ id: string }>,
  res: Response<DeletePostResponse>,
): Promise<void> {
  const { id } = req.params;
  await deletePost(id);

  res.status(200).json({ message: "Post deleted successfully" });
}