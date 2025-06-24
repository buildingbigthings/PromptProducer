import { users, promptHistory, type User, type InsertUser, type PromptHistory, type InsertPromptHistory } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  savePromptHistory(promptData: InsertPromptHistory): Promise<PromptHistory>;
  getPromptHistory(userId?: number, limit?: number): Promise<PromptHistory[]>;
  updatePromptHistory(id: number, updateData: Partial<PromptHistory>): Promise<PromptHistory>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async savePromptHistory(promptData: InsertPromptHistory): Promise<PromptHistory> {
    const [savedPrompt] = await db
      .insert(promptHistory)
      .values(promptData)
      .returning();
    return savedPrompt;
  }

  async getPromptHistory(userId?: number, limit: number = 50): Promise<PromptHistory[]> {
    if (userId) {
      return await db
        .select()
        .from(promptHistory)
        .where(eq(promptHistory.userId, userId))
        .orderBy(desc(promptHistory.createdAt))
        .limit(limit);
    }
    
    return await db
      .select()
      .from(promptHistory)
      .orderBy(desc(promptHistory.createdAt))
      .limit(limit);
  }

  async updatePromptHistory(id: number, updateData: Partial<PromptHistory>): Promise<PromptHistory> {
    const [updatedPrompt] = await db
      .update(promptHistory)
      .set(updateData)
      .where(eq(promptHistory.id, id))
      .returning();
    
    return updatedPrompt;
  }
}

export const storage = new DatabaseStorage();
