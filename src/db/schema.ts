import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

export const todo = sqliteTable("todo", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	message: text("message").notNull(),
	createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdateFn(() => new Date().toISOString()),
});

export const selectTodoSchema = createSelectSchema(todo, {
	message: z.string(),
});

export const insertTodoSchema = createInsertSchema(todo, {
	message: (f) => f.min(1),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const patchTodoSchema = insertTodoSchema.partial();
