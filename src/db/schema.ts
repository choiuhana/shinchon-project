import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name"),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	role: text("role").notNull().default("parent"),
	status: text("status").notNull().default("pending"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const newsPosts = pgTable("news_posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: text("slug").notNull().unique(),
	title: text("title").notNull(),
	category: text("category").notNull(),
	summary: text("summary"),
	content: text("content").notNull(),
	heroImageUrl: text("hero_image_url"),
	heroImageAlt: text("hero_image_alt"),
	publishAt: timestamp("publish_at"),
	isHighlighted: boolean("is_highlighted").notNull().default(false),
	audienceScope: text("audience_scope").notNull().default("public"),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const newsAttachments = pgTable("news_attachments", {
	id: uuid("id").primaryKey().defaultRandom(),
	postId: uuid("post_id").notNull().references(() => newsPosts.id, { onDelete: "cascade" }),
	fileUrl: text("file_url").notNull(),
	label: text("label"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
