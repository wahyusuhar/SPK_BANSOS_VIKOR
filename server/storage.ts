import { randomUUID } from "crypto";
import session from "express-session";

// HAPUS import memorystore agar tidak error jika package.json belum terupdate
// import createMemoryStore from "memorystore"; 

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
  private users: Map<string, User>;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    
    // KITA GUNAKAN BAWAAN (DEFAULT) AGAR PASTI JALAN
    // Ini aman untuk Vercel (karena serverless sering restart anyway)
    // dan menjamin tidak ada error "Module missing".
    this.sessionStore = new session.MemoryStore();

    this.initializeDefaultUser();
  }

  private initializeDefaultUser() {
    const id = "admin-id";
    const user: User = { 
      id, 
      username: "admin", 
      password: "admin",
      role: "admin"
    };
    this.users.set(id, user);
    console.log("[Storage] Default admin user initialized");
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
    const user: User = { ...insertUser, id, role: "user" };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();