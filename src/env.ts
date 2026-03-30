import { z } from "zod";

export const EnvSchema = z
	.object({
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		LOG_LEVEL: z
			.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
			.default("info"),
		DB: z.custom<D1Database>((val) => typeof val === "object" && val !== null),
	})
	.superRefine((input, ctx) => {
		if (input.NODE_ENV === "production" && !input.DB) {
			ctx.addIssue({
				code: "custom",
				path: ["DATABASE"],
				message: "Must be set when NODE_ENV is 'production'",
			});
		}
	});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Validate Cloudflare env
 */
export function validateEnv(env: unknown): Env {
	const result = EnvSchema.safeParse(env);

	if (!result.success) {
		console.error("❌ Invalid env:");
		console.error(JSON.stringify(z.flattenError(result.error)));
		throw new Error("Invalid environment variables");
	}

	return result.data;
}
