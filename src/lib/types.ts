import { PinoLogger } from "hono-pino";
import { Env } from "../env";
import { Schema } from "hono";
import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

type Variables = {
	logger: PinoLogger;
};

export type AppEnv = {
	Bindings: Env;
	Variables: Variables;
};

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppEnv, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;
