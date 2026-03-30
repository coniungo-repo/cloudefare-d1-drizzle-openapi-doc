import createMessageObjectSchema from "../openapi/schemas/create-message-object";
import * as HttpStatusPhrases from "../utils/http-status-phrases";

export const ZOD_ERROR_MESSAGES = {
	REQUIRED: "Required",
	EXPECTED_NUMBER: "Invalid input: expected number, received NaN",
	NO_UPDATES: "No updates provided",
	EXPECTED_STRING: "Invalid input: expected string, received undefined",
};

export const ZOD_ERROR_CODES = {
	INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(
	HttpStatusPhrases.NOT_FOUND,
);
