import session from "express-session";

// Dummy User interface
export interface User {
  id: string;
  username: string;
  password: string;
  role?: string;
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

export class MemStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new session.MemoryStore();
  }

  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserCount(): Promise<number> {
    return 0;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    throw new Error("Not implemented");
  }
}

export const storage = new MemStorage();
