import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("notes API", () => {
  it("creates a new note successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notes.create({
      moduleId: 1,
      content: "This is a test note about AI fundamentals",
    });

    expect(result).toEqual({ success: true });
  });

  it("lists notes for a module", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a note first
    await caller.notes.create({
      moduleId: 1,
      content: "Test note for listing",
    });

    // List notes
    const notes = await caller.notes.list({ moduleId: 1 });

    expect(Array.isArray(notes)).toBe(true);
    expect(notes.length).toBeGreaterThan(0);
    expect(notes[0]).toHaveProperty("content");
    expect(notes[0]).toHaveProperty("userId");
    expect(notes[0]).toHaveProperty("moduleId");
  });

  it("updates a note successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a note
    await caller.notes.create({
      moduleId: 1,
      content: "Original content",
    });

    // Get the note ID
    const notes = await caller.notes.list({ moduleId: 1 });
    const noteId = notes[0]?.id;

    if (!noteId) {
      throw new Error("Note not created");
    }

    // Update the note
    const result = await caller.notes.update({
      id: noteId,
      content: "Updated content",
    });

    expect(result).toEqual({ success: true });
  });

  it("deletes a note successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a note
    await caller.notes.create({
      moduleId: 1,
      content: "Note to be deleted",
    });

    // Get the note ID
    const notesBefore = await caller.notes.list({ moduleId: 1 });
    const noteId = notesBefore[0]?.id;

    if (!noteId) {
      throw new Error("Note not created");
    }

    // Delete the note
    const result = await caller.notes.delete({ id: noteId });

    expect(result).toEqual({ success: true });
  });
});
