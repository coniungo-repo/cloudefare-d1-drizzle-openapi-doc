import type { ErrorHandler } from "hono";
import { AppEnv } from "../lib/types";

const onError: ErrorHandler<AppEnv> = (err, c) => {
	const logger = c.get("logger");

	const status = err instanceof Error ? 500 : 500;

	logger?.error(
		{
			err,
			path: c.req.path,
			method: c.req.method,
		},
		"Unhandled error",
	);

	const isProduction = c.env.NODE_ENV === "production";

	return c.json(
		{
			success: false,
			error: {
				message: err.message,
				code: status,
			},
			stack: isProduction ? undefined : err.stack,
		},
		status,
	);
};

export default onError;
