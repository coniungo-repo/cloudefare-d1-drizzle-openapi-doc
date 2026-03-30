import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "../../utils/http-status-codes";
import jsonContent from "../../openapi/helpers/json-content";
import jsonContentRequired from "../../openapi/helpers/json-content-required";
import createErrorSchema from "../../openapi/schemas/create-error-schema";
import IdParamsSchema from "../../openapi/schemas/id-params";
import { notFoundSchema } from "../../lib/constants";
import {
	insertTodoSchema,
	patchTodoSchema,
	selectTodoSchema,
} from "../../db/schema";

const tags = ["Todos"];

export const list = createRoute({
	path: "/todos",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.array(selectTodoSchema),
			"The list of todos",
		),
	},
});

export const create = createRoute({
	path: "/todos",
	method: "post",
	request: {
		body: jsonContentRequired(insertTodoSchema, "The todo to create"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectTodoSchema, "The created todo"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(insertTodoSchema),
			"The validation error(s)",
		),
	},
});

export const getOne = createRoute({
	path: "/todos/{id}",
	method: "get",
	request: {
		params: IdParamsSchema,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectTodoSchema, "The requested todo"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Todo not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			"Invalid id error",
		),
	},
});

export const patch = createRoute({
	path: "/todos/{id}",
	method: "patch",
	request: {
		params: IdParamsSchema,
		body: jsonContentRequired(patchTodoSchema, "The todo update"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(selectTodoSchema, "The updated todo"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Todo not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(patchTodoSchema).or(createErrorSchema(IdParamsSchema)),
			"The validation error(s)",
		),
	},
});

export const remove = createRoute({
	path: "/todos/{id}",
	method: "delete",
	request: {
		params: IdParamsSchema,
	},
	tags,
	responses: {
		[HttpStatusCodes.NO_CONTENT]: {
			description: "Todo deleted",
		},
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Todo not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdParamsSchema),
			"Invalid id error",
		),
	},
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
