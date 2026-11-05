import { HttpError } from "../utils/HttpError.js";
import { isRecord } from "../utils/typeGuards.js";
import type { CreatePostInput, UpdatePostInput } from "../types/post.types.js";

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 150;
const MIN_CONTENT_LENGTH = 5;

export function validateCreatePostBody(body: unknown): CreatePostInput {
  if (!isRecord(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }

  const { title, content } = body;

  if (typeof title !== "string" || title.trim().length < MIN_TITLE_LENGTH) {
    throw new HttpError(400, `Title must be at least ${MIN_TITLE_LENGTH} characters`);
  }

  if (title.trim().length > MAX_TITLE_LENGTH) {
    throw new HttpError(400, `Title must be at most ${MAX_TITLE_LENGTH} characters`);
  }

  if (typeof content !== "string" || content.trim().length < MIN_CONTENT_LENGTH) {
    throw new HttpError(400, `Content must be at least ${MIN_CONTENT_LENGTH} characters`);
  }

  return {
    title: title.trim(),
    content: content.trim(),
  };
}

export function validateUpdatePostBody(body: unknown): UpdatePostInput {
  if (!isRecord(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }

  const { title, content } = body;
  const result: UpdatePostInput = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length < MIN_TITLE_LENGTH) {
      throw new HttpError(400, `Title must be at least ${MIN_TITLE_LENGTH} characters`);
    }
    if (title.trim().length > MAX_TITLE_LENGTH) {
      throw new HttpError(400, `Title must be at most ${MAX_TITLE_LENGTH} characters`);
    }
    result.title = title.trim();
  }

  if (content !== undefined) {
    if (typeof content !== "string" || content.trim().length < MIN_CONTENT_LENGTH) {
      throw new HttpError(400, `Content must be at least ${MIN_CONTENT_LENGTH} characters`);
    }
    result.content = content.trim();
  }

  if (result.title === undefined && result.content === undefined) {
    throw new HttpError(400, "At least one field (title or content) must be provided for update");
  }

  return result;
}