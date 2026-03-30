import pino from "pino";
import type { Env } from "../env";

export const createLogger = (env: Env) => {
	const isDev = env.NODE_ENV !== "production";
	return pino({
		level: env.LOG_LEVEL || "info",
		transport: isDev
			? { target: "pino-pretty", options: { colorize: true } }
			: undefined,
	});
};
