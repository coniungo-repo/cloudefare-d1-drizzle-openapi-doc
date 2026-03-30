import { eq } from "drizzle-orm";
import { initDbConnect } from "../../db";
import { todo } from "../../db/schema";
import { AppRouteHandler } from "../../lib/types";
import * as HttpStatusCodes from "../../utils/http-status-codes";
import * as HttpStatusPhrases from "../../utils/http-status-phrases";
import {
	CreateRoute,
	GetOneRoute,
	ListRoute,
	PatchRoute,
	RemoveRoute,
} from "./todo.routes";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "../../lib/constants";

export const list: AppRouteHandler<ListRoute> = async (c) => {
	const db = initDbConnect(c.env.DB);

	const todo = await db.query.todo.findMany();
	return c.json(todo);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
	const toolData = c.req.valid("json");

	const db = initDbConnect(c.env.DB);

	const [inserted] = await db.insert(todo).values(toolData).returning();

	return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
	const { id } = c.req.valid("param");

	const db = initDbConnect(c.env.DB);

	const task = await db.query.todo.findFirst({
		where(fields, operators) {
			return operators.eq(fields.id, id);
		},
	});

	if (!task) {
		return c.json(
			{
				message: HttpStatusPhrases.NOT_FOUND,
			},
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
	const { id } = c.req.valid("param");
	const updates = c.req.valid("json");

	if (Object.keys(updates).length === 0) {
		return c.json(
			{
				success: false,
				error: {
					issues: [
						{
							code: ZOD_ERROR_CODES.INVALID_UPDATES,
							path: [],
							message: ZOD_ERROR_MESSAGES.NO_UPDATES,
						},
					],
					name: "ZodError",
				},
			},
			HttpStatusCodes.UNPROCESSABLE_ENTITY,
		);
	}

	const db = initDbConnect(c.env.DB);

	const [task] = await db
		.update(todo)
		.set(updates)
		.where(eq(todo.id, id))
		.returning();

	if (!task) {
		return c.json(
			{
				message: HttpStatusPhrases.NOT_FOUND,
			},
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.json(task, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
	const { id } = c.req.valid("param");
	const db = initDbConnect(c.env.DB);

	const [deleted] = await db.delete(todo).where(eq(todo.id, id)).returning();

	if (!deleted) {
		return c.json(
			{ message: HttpStatusPhrases.NOT_FOUND },
			HttpStatusCodes.NOT_FOUND,
		);
	}

	return c.body(null, HttpStatusCodes.NO_CONTENT);
};
