import { prisma } from "../lib/prisma.js";
import { HttpError } from "../utils/HttpError.js";
import { publicUserSelect } from "./auth.service.js";
import type { CreatePostInput, PostWithAuthor, UpdatePostInput } from "../types/post.types.js";

const postWithAuthorInclude = {
  author: {
    select: publicUserSelect,
  },
} as const;

export async function getAllPosts(): Promise<PostWithAuthor[]> {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: postWithAuthorInclude,
  });
}

export async function getPostById(id: string): Promise<PostWithAuthor> {
  const post = await prisma.post.findUnique({
    where: { id },
    include: postWithAuthorInclude,
  });

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  return post;
}

export async function createPost(input: CreatePostInput, authorId: string): Promise<PostWithAuthor> {
  return prisma.post.create({
    data: {
      title: input.title,
      content: input.content,
      authorId,
    },
    include: postWithAuthorInclude,
  });
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<PostWithAuthor> {
  await getPostById(id);

  return prisma.post.update({
    where: { id },
    data: input,
    include: postWithAuthorInclude,
  });
}

export async function deletePost(id: string): Promise<void> {
  await getPostById(id);

  await prisma.post.delete({
    where: { id },
  });
}