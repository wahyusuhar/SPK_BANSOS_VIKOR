import { randomUUID, scryptSync, randomBytes } from "crypto";
import session from "express-session";

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserCount(): Promise<number>;
  sessionStore: session.Store;
}

function hashPasswordSync(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = scryptSync(password, salt, 64) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.sessionStore = new session.MemoryStore();
    this.initializeDefaultUser();
  }

  private initializeDefaultUser() {
    const password = hashPasswordSync("admin");
    const id = randomUUID();
    const user: User = { id, username: "admin", password };
    this.users.set(id, user);
    console.log("Default admin user initialized");
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
    const password = hashPasswordSync(insertUser.password);
    const user: User = { ...insertUser, password, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
