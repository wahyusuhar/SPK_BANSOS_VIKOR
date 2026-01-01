import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface User {
  id: string;
  username: string;
  password: string;
  // Menambahkan field role opsional agar kompatibel jika dikembangkan
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
    
    // PERBAIKAN: Menggunakan 'memorystore' yang production-ready
    // agar session tidak bocor (memory leak) dan lebih stabil di Vercel.
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Prune expired entries every 24h
    });

    this.initializeDefaultUser();
  }

  private initializeDefaultUser() {
    // Pastikan user admin selalu ada setiap kali server Vercel restart/wake up
    const id = "admin-id";
    const user: User = { 
      id, 
      username: "admin", 
      password: "admin",
      role: "admin"
    };
    this.users.set(id, user);
    console.log("[Storage] Default admin user initialized in memory");
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