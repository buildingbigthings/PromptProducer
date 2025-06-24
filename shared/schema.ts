import { pgTable, text, serial, integer, json, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promptHistory = pgTable("prompt_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  templateId: text("template_id").notNull(),
  templateName: text("template_name").notNull(),
  formData: json("form_data").notNull(),
  generatedPrompt: text("generated_prompt").notNull(),
  isFavorite: boolean("is_favorite").default(false).notNull(),
  tags: text("tags").array(),
  notes: text("notes"),
  promptGoal: text("prompt_goal"),
  promptRole: text("prompt_role"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  promptHistory: many(promptHistory),
}));

export const promptHistoryRelations = relations(promptHistory, ({ one }) => ({
  user: one(users, {
    fields: [promptHistory.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPromptHistorySchema = createInsertSchema(promptHistory).pick({
  userId: true,
  templateId: true,
  templateName: true,
  formData: true,
  generatedPrompt: true,
  isFavorite: true,
  tags: true,
  notes: true,
  promptGoal: true,
  promptRole: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPromptHistory = z.infer<typeof insertPromptHistorySchema>;
export type PromptHistory = typeof promptHistory.$inferSelect;
