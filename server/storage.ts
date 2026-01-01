import { type User, type InsertUser } from "../shared/schema";
import { randomUUID, scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import session from "express-session";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserCount(): Promise<number>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.sessionStore = new session.MemoryStore();
    this.initializeDefaultUser();
  }

  private async initializeDefaultUser() {
    const password = await hashPassword("admin");
    const id = randomUUID();
    const user: User = { id, username: "admin", password };
    this.users.set(id, user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
