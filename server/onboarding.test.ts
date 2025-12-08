import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Onboarding System", () => {
  const mockUser = {
    id: 999,
    openId: "test-onboarding-user",
    name: "Test User",
    email: "test@example.com",
    role: "user" as const,
    onboardingCompleted: 0,
  };

  const createMockContext = (user: typeof mockUser | null = null) => ({
    user,
    req: {} as any,
    res: {} as any,
  });

  beforeEach(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Clean up test user if exists
    await db.delete(users).where(eq(users.openId, mockUser.openId));

    // Insert fresh test user
    const result = await db.insert(users).values({
      openId: mockUser.openId,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      onboardingCompleted: 0,
    });

    // Get the inserted user to update mockUser.id
    const insertedUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, mockUser.openId))
      .limit(1);

    if (insertedUser[0]) {
      mockUser.id = insertedUser[0].id;
    }
  });

  it("should update user onboarding preferences", async () => {
    const caller = appRouter.createCaller(createMockContext(mockUser));

    const result = await caller.user.updateOnboarding({
      experienceLevel: "beginner",
      learningGoals: JSON.stringify(["career_change", "skill_enhancement"]),
      interests: JSON.stringify(["machine_learning", "deep_learning"]),
    });

    expect(result.success).toBe(true);

    // Verify database was updated
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, mockUser.openId))
      .limit(1);

    expect(updatedUser[0].experienceLevel).toBe("beginner");
    expect(updatedUser[0].onboardingCompleted).toBe(1);
    expect(updatedUser[0].learningGoals).toBe(
      JSON.stringify(["career_change", "skill_enhancement"])
    );
    expect(updatedUser[0].interests).toBe(
      JSON.stringify(["machine_learning", "deep_learning"])
    );
  });

  it("should require authentication for onboarding update", async () => {
    const caller = appRouter.createCaller(createMockContext(null));

    await expect(
      caller.user.updateOnboarding({
        experienceLevel: "intermediate",
        learningGoals: JSON.stringify(["academic"]),
        interests: JSON.stringify(["nlp"]),
      })
    ).rejects.toThrow();
  });

  it("should handle different experience levels", async () => {
    const caller = appRouter.createCaller(createMockContext(mockUser));

    const levels = ["beginner", "intermediate", "advanced"];

    for (const level of levels) {
      const result = await caller.user.updateOnboarding({
        experienceLevel: level,
        learningGoals: JSON.stringify(["hobby"]),
        interests: JSON.stringify(["all"]),
      });

      expect(result.success).toBe(true);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updatedUser = await db
        .select()
        .from(users)
        .where(eq(users.openId, mockUser.openId))
        .limit(1);

      expect(updatedUser[0].experienceLevel).toBe(level);
    }
  });

  it("should store multiple learning goals as JSON", async () => {
    const caller = appRouter.createCaller(createMockContext(mockUser));

    const goals = ["career_change", "skill_enhancement", "academic", "hobby", "business"];

    const result = await caller.user.updateOnboarding({
      experienceLevel: "intermediate",
      learningGoals: JSON.stringify(goals),
      interests: JSON.stringify(["machine_learning"]),
    });

    expect(result.success).toBe(true);

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, mockUser.openId))
      .limit(1);

    const storedGoals = JSON.parse(updatedUser[0].learningGoals || "[]");
    expect(storedGoals).toEqual(goals);
  });

  it("should store multiple interests as JSON", async () => {
    const caller = appRouter.createCaller(createMockContext(mockUser));

    const interests = ["machine_learning", "deep_learning", "nlp", "computer_vision"];

    const result = await caller.user.updateOnboarding({
      experienceLevel: "advanced",
      learningGoals: JSON.stringify(["career_change"]),
      interests: JSON.stringify(interests),
    });

    expect(result.success).toBe(true);

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, mockUser.openId))
      .limit(1);

    const storedInterests = JSON.parse(updatedUser[0].interests || "[]");
    expect(storedInterests).toEqual(interests);
  });

  it("should mark onboarding as completed", async () => {
    const caller = appRouter.createCaller(createMockContext(mockUser));

    // Verify user starts with onboarding incomplete
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const initialUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, mockUser.openId))
      .limit(1);

    expect(initialUser[0].onboardingCompleted).toBe(0);

    // Complete onboarding
    await caller.user.updateOnboarding({
      experienceLevel: "beginner",
      learningGoals: JSON.stringify(["hobby"]),
      interests: JSON.stringify(["all"]),
    });

    // Verify onboarding is marked complete
    const completedUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, mockUser.openId))
      .limit(1);

    expect(completedUser[0].onboardingCompleted).toBe(1);
  });
});
