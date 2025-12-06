import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("Learning Paths API", () => {
  it("should list all published learning paths", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const paths = await caller.learningPaths.list();

    expect(paths).toBeDefined();
    expect(Array.isArray(paths)).toBe(true);
    expect(paths.length).toBeGreaterThan(0);
    
    // Check that paths have required fields
    const firstPath = paths[0];
    expect(firstPath).toHaveProperty("id");
    expect(firstPath).toHaveProperty("title");
    expect(firstPath).toHaveProperty("slug");
    expect(firstPath).toHaveProperty("difficulty");
    expect(firstPath?.isPublished).toBe(true);
  });

  it("should get a learning path by slug", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const path = await caller.learningPaths.getBySlug({ slug: "ai-fundamentals" });

    expect(path).toBeDefined();
    expect(path?.title).toBe("AI Fundamentals");
    expect(path?.slug).toBe("ai-fundamentals");
    expect(path?.difficulty).toBe("beginner");
  });

  it("should return undefined for non-existent path", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const path = await caller.learningPaths.getBySlug({ slug: "non-existent-path" });

    expect(path).toBeUndefined();
  });
});

describe("Modules API", () => {
  it("should get modules by path ID", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const modules = await caller.modules.getByPathId({ pathId: 1 });

    expect(modules).toBeDefined();
    expect(Array.isArray(modules)).toBe(true);
    expect(modules.length).toBeGreaterThan(0);
    
    // Check that modules have required fields
    const firstModule = modules[0];
    expect(firstModule).toHaveProperty("id");
    expect(firstModule).toHaveProperty("title");
    expect(firstModule).toHaveProperty("slug");
    expect(firstModule).toHaveProperty("content");
    expect(firstModule?.pathId).toBe(1);
  });

  it("should get a module by slug", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const module = await caller.modules.getBySlug({ slug: "what-is-ai" });

    expect(module).toBeDefined();
    expect(module?.title).toBe("What is Artificial Intelligence?");
    expect(module?.slug).toBe("what-is-ai");
    expect(module?.pathId).toBe(1);
  });

  it("should return undefined for non-existent module", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const module = await caller.modules.getBySlug({ slug: "non-existent-module" });

    expect(module).toBeUndefined();
  });
});

describe("Resources API", () => {
  it("should list all published resources", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const resources = await caller.resources.list();

    expect(resources).toBeDefined();
    expect(Array.isArray(resources)).toBe(true);
    expect(resources.length).toBeGreaterThan(0);
    
    // Check that resources have required fields
    const firstResource = resources[0];
    expect(firstResource).toHaveProperty("id");
    expect(firstResource).toHaveProperty("title");
    expect(firstResource).toHaveProperty("resourceType");
    expect(firstResource?.isPublished).toBe(true);
  });
});
