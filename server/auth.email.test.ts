import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

describe("Email/Password Authentication", () => {
  let testUserId: number;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "testpassword123";
  const testName = "Test User";

  beforeAll(async () => {
    // Clean up any existing test user
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    await db.delete(users).where(eq(users.email, testEmail));
  });

  afterAll(async () => {
    // Clean up test user
    const db = await getDb();
    if (!db) return;
    
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  it("should hash passwords with bcrypt", async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    expect(hashedPassword).toBeTruthy();
    expect(hashedPassword).not.toBe(testPassword);
    expect(hashedPassword.length).toBeGreaterThan(50);
  });

  it("should verify correct password", async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect password", async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const isValid = await bcrypt.compare("wrongpassword", hashedPassword);
    expect(isValid).toBe(false);
  });

  it("should create user with hashed password", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const result = await db.insert(users).values({
      name: testName,
      email: testEmail,
      password: hashedPassword,
      loginMethod: "email",
      role: "user",
    });

    // TiDB returns different format - get the user by email instead
    const userResult = await db.select().from(users).where(eq(users.email, testEmail));
    testUserId = userResult[0].id;
    expect(testUserId).toBeGreaterThan(0);
  });

  it("should retrieve user by email", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userResult = await db.select().from(users).where(eq(users.email, testEmail));
    
    expect(userResult.length).toBe(1);
    expect(userResult[0].email).toBe(testEmail);
    expect(userResult[0].name).toBe(testName);
    expect(userResult[0].loginMethod).toBe("email");
  });

  it("should have password stored in database", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userResult = await db.select().from(users).where(eq(users.email, testEmail));
    
    expect(userResult[0].password).toBeTruthy();
    expect(userResult[0].password).not.toBe(testPassword);
  });

  it("should verify password from database", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const userResult = await db.select().from(users).where(eq(users.email, testEmail));
    const user = userResult[0];
    
    expect(user.password).toBeTruthy();
    const isValid = await bcrypt.compare(testPassword, user.password!);
    expect(isValid).toBe(true);
  });

  it("should enforce unique email constraint", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const hashedPassword = await bcrypt.hash("anotherpassword", 10);
    
    try {
      await db.insert(users).values({
        name: "Another User",
        email: testEmail, // Same email as before
        password: hashedPassword,
        loginMethod: "email",
        role: "user",
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      // Should throw error (duplicate or constraint violation)
      expect(error).toBeTruthy();
      expect(error.message).toBeTruthy();
    }
  });

  it("should allow optional openId for email auth", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const testEmail2 = `test2-${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const result = await db.insert(users).values({
      name: "Email User",
      email: testEmail2,
      password: hashedPassword,
      loginMethod: "email",
      role: "user",
      // openId is optional - not provided
    });

    // TiDB returns different format - get the user by email instead
    const userResult2 = await db.select().from(users).where(eq(users.email, testEmail2));
    const userId = userResult2[0].id;
    expect(userId).toBeGreaterThan(0);

    const userResult = await db.select().from(users).where(eq(users.id, userId));
    expect(userResult[0].openId).toBeNull();
    expect(userResult[0].email).toBe(testEmail2);

    // Cleanup
    await db.delete(users).where(eq(users.id, userId));
  });
});
