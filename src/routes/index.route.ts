import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "../utils/http-status-codes";
import { createRouter } from "../lib/create-app";
import jsonContent from "../openapi/helpers/json-content";
import createMessageObjectSchema from "../openapi/schemas/create-message-object";

const router = createRouter().openapi(
	createRoute({
		tags: ["Index"],
		method: "get",
		path: "/",
		responses: {
			[HttpStatusCodes.OK]: jsonContent(
				createMessageObjectSchema("Coniungo API template"),
				"Coniungo API template Index",
			),
		},
	}),
	(c) => {
		return c.json(
			{
				message: "Coniungo API template",
			},
			HttpStatusCodes.OK,
		);
	},
);

export default router;
