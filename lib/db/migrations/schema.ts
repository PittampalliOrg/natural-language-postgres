import { pgTable, uuid, varchar, foreignKey, timestamp, text, boolean, json, index, unique, serial, numeric, date, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 64 }),
});

export const chat = pgTable("chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	userId: uuid().notNull(),
	title: text().notNull(),
	visibility: varchar().default('private').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "chat_userId_user_id_fk"
		}),
]);

export const suggestion = pgTable("suggestion", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid().notNull(),
	documentCreatedAt: timestamp({ mode: 'string' }).notNull(),
	originalText: text().notNull(),
	suggestedText: text().notNull(),
	description: text(),
	isResolved: boolean().default(false).notNull(),
	userId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "suggestion_userId_user_id_fk"
		}),
	foreignKey({
			columns: [table.documentId, table.documentCreatedAt],
			foreignColumns: [document.id, document.createdAt],
			name: "suggestion_documentId_documentCreatedAt_document_id_createdAt_f"
		}),
]);

export const message = pgTable("message", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	content: json().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "message_chatId_chat_id_fk"
		}),
]);

export const daprMetadata = pgTable("dapr_metadata", {
	key: text().primaryKey().notNull(),
	value: text().notNull(),
});


export const unicorns = pgTable("unicorns", {
	id: serial().primaryKey().notNull(),
	company: varchar({ length: 255 }).notNull(),
	valuation: numeric({ precision: 10, scale:  2 }).notNull(),
	dateJoined: date("date_joined"),
	country: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	industry: varchar({ length: 255 }).notNull(),
	selectInvestors: text("select_investors").notNull(),
}, (table) => [
	unique("unicorns_company_key").on(table.company),
]);

export const vote = pgTable("vote", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chat.id],
			name: "vote_chatId_chat_id_fk"
		}),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [message.id],
			name: "vote_messageId_message_id_fk"
		}),
	primaryKey({ columns: [table.chatId, table.messageId], name: "vote_chatId_messageId_pk"}),
]);

export const document = pgTable("document", {
	id: uuid().defaultRandom().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	title: text().notNull(),
	content: text(),
	userId: uuid().notNull(),
	text: varchar().default('text').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "document_userId_user_id_fk"
		}),
	primaryKey({ columns: [table.id, table.createdAt], name: "document_id_createdAt_pk"}),
]);
