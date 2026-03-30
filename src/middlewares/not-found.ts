import type { NotFoundHandler } from "hono";
import { NOT_FOUND } from "../utils/http-status-codes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../utils/http-status-phrases";
import { AppEnv } from "../lib/types";

const notFound: NotFoundHandler<AppEnv> = (c) => {
	const logger = c.get("logger");

	logger?.warn(
		{
			path: c.req.path,
			method: c.req.method,
		},
		"Route not found",
	);

	return c.json(
		{
			success: false,
			error: {
				message: NOT_FOUND_MESSAGE,
				path: c.req.path,
			},
		},
		NOT_FOUND,
	);
};

export default notFound;
