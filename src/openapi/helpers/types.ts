import type { z } from "@hono/zod-openapi";

// eslint-disable-next-line ts/ban-ts-comment
export type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodObject>;

export type ZodIssue = z.core.$ZodIssue;
