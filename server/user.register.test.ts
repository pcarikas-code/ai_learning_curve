import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("user.register", () => {
  let testEmail: string;
  
  beforeAll(() => {
    testEmail = `test_${Date.now()}@example.com`;
  });

  afterAll(async () => {
    // Cleanup: delete test user
    const db = await getDb();
    if (db) {
      await db.delete(users).where(eq(users.email, testEmail));
    }
  });

  it("should register a new user with name and email", async () => {
    const caller = appRouter.createCaller({ user: null } as any);
    
    const result = await caller.user.register({
      name: "Test User",
      email: testEmail,
    });

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("name", "Test User");
    expect(result).toHaveProperty("email", testEmail);
    expect(result.token).toMatch(/^user_/);
  });

  it("should return existing user if email already registered", async () => {
    const caller = appRouter.createCaller({ user: null } as any);
    
    // Register first time
    const firstResult = await caller.user.register({
      name: "Test User",
      email: testEmail,
    });

    // Try to register again with same email
    const secondResult = await caller.user.register({
      name: "Different Name",
      email: testEmail,
    });

    // Should return same token and original name
    expect(secondResult.token).toBe(firstResult.token);
    expect(secondResult.name).toBe("Test User"); // Original name, not "Different Name"
    expect(secondResult.email).toBe(testEmail);
  });

  it("should validate email format", async () => {
    const caller = appRouter.createCaller({ user: null } as any);
    
    await expect(
      caller.user.register({
        name: "Test User",
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });

  it("should validate name is not empty", async () => {
    const caller = appRouter.createCaller({ user: null } as any);
    
    await expect(
      caller.user.register({
        name: "",
        email: "test@example.com",
      })
    ).rejects.toThrow();
  });
});
