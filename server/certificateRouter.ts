import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { nanoid } from "nanoid";

export const certificateRouter = router({
  // Generate certificate for completed path
  generate: protectedProcedure
    .input(z.object({ pathId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { pathId } = input;
      const userId = ctx.user.id;

      // Check if certificate already exists
      const existing = await db.getCertificate(userId, pathId);
      if (existing) {
        return {
          success: true,
          certificate: existing,
          message: "Certificate already exists",
        };
      }

      // Get path details  
      const paths = await db.getAllLearningPaths();
      const path = paths.find(p => p.id === pathId);
      if (!path) {
        throw new Error("Learning path not found");
      }

      // Get all modules for this path
      const modules = await db.getModulesByPathId(pathId);
      
      // Check if all modules are completed
      const allCompleted = await Promise.all(
        modules.map(async (module) => {
          const progress = await db.getUserProgress(userId, module.id);
          return progress?.status === "completed" || false;
        })
      );

      if (!allCompleted.every(Boolean)) {
        throw new Error("Not all modules completed");
      }

      // Generate unique certificate number
      const certificateNumber = `ALC-${Date.now()}-${nanoid(8).toUpperCase()}`;

      // Create certificate
      await db.createCertificate(userId, pathId, certificateNumber);

      const certificate = await db.getCertificate(userId, pathId);

      return {
        success: true,
        certificate,
        message: "Certificate generated successfully",
      };
    }),

  // Get certificate by path
  getByPath: protectedProcedure
    .input(z.object({ pathId: z.number() }))
    .query(async ({ ctx, input }) => {
      const certificate = await db.getCertificate(ctx.user.id, input.pathId);
      return certificate || null;
    }),

  // Verify certificate by number (public)
  verify: publicProcedure
    .input(z.object({ certificateNumber: z.string() }))
    .query(async ({ input }) => {
      const certificate = await db.getCertificateByNumber(input.certificateNumber);
      if (!certificate) {
        return { valid: false };
      }

      const user = await db.getUserByOpenId(certificate.userId.toString());
      const paths = await db.getAllLearningPaths();
      const path = paths.find(p => p.id === certificate.pathId);

      return {
        valid: true,
        certificate,
        userName: user?.name || "Unknown",
        pathTitle: path?.title || "Unknown",
      };
    }),
});
