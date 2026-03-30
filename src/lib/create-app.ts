import { OpenAPIHono } from "@hono/zod-openapi";
import { pinoLogger } from "../middlewares/pino-logger";
import notFound from "../middlewares/not-found";
import onError from "../middlewares/on-error";
import { createMiddleware } from "hono/factory";
import { AppEnv, AppOpenAPI } from "./types";
import defaultHook from "../openapi/default-hook";

export function createRouter() {
	return new OpenAPIHono<AppEnv>({
		strict: false,
		defaultHook: defaultHook,
	});
}

export default function createApp() {
	const app = createRouter();

	app.use(
		"*",
		createMiddleware<AppEnv>(async (c, next) => {
			const handler = pinoLogger(c.env);

			return handler(c as unknown as Parameters<typeof handler>[0], next);
		}),
	);

	app.notFound(notFound);
	app.onError(onError);

	return app;
}

export function createTestApp(router: AppOpenAPI) {
	const testApp = createApp();
	testApp.route("/", router);
	return testApp;
}
