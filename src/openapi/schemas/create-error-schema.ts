import { z } from "@hono/zod-openapi";

import type { ZodIssue, ZodSchema } from "../helpers/types.ts";
import { ZodArray, ZodString } from "zod";

const createErrorSchema = <T extends ZodSchema>(schema: T) => {
	let invalidInput: any = {};

	if (schema instanceof ZodArray) {
		const isStringArray = schema.element instanceof ZodString;
		invalidInput = [isStringArray ? 123 : "invalid"];
	} else if (schema instanceof ZodString) {
		invalidInput = 123;
	}

	const { error } = schema.safeParse(invalidInput);

	const example = error
		? {
				name: error.name,
				issues: error.issues.map((issue: ZodIssue) => ({
					code: issue.code,
					path: issue.path,
					message: issue.message,
				})),
			}
		: {
				name: "ZodError",
				issues: [
					{
						code: "invalid_type",
						path: ["fieldName"],
						message: "Expected string, received undefined",
					},
				],
			};

	return z.object({
		success: z.boolean().openapi({ example: false }),
		error: z
			.object({
				name: z.string(),
				issues: z.array(
					z.object({
						code: z.string(),
						path: z.array(z.union([z.string(), z.number()])),
						message: z.string().optional(),
					}),
				),
			})
			.openapi({ example }),
	});
};

export default createErrorSchema;
