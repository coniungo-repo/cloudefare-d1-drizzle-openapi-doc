import { pinoLogger as logger } from "hono-pino";
import { createLogger } from "../utils/logger";
import { Env } from "../env";

export function pinoLogger(env: Env) {
	return logger({
		pino: createLogger(env),
		http: {
			reqId: () => crypto.randomUUID(),
		},
	});
}
