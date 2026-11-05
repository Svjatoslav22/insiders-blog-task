import type { Post } from "../generated/prisma/client.js";
import type { PublicUser } from "./auth.types.js";

/** Пост з даними автора (публічний вигляд) */
export interface PostWithAuthor extends Post {
  author: PublicUser;
}

export interface CreatePostInput {
  title: string;
  content: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
}

export interface PostListResponse {
  posts: PostWithAuthor[];
}

export interface PostResponse {
  post: PostWithAuthor;
}

export interface DeletePostResponse {
  message: string;
}