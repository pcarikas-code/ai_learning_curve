import { eq, and, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { 
  InsertUser, 
  users, 
  certificates,
  learningPaths, 
  modules, 
  userProgress, 
  quizzes, 
  quizQuestions, 
  quizAttempts, 
  resources, 
  bookmarks,
  moduleNotes,
  pathEnrollments,
  InsertLearningPath,
  InsertModule,
  InsertUserProgress,
  InsertQuiz,
  InsertQuizQuestion,
  InsertQuizAttempt,
  InsertModuleNote,
  InsertResource,
  InsertBookmark,
  InsertPathEnrollment
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
      });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== User Management =====

export async function upsertUser(user: InsertUser): Promise<void> {
  // For email/password auth, openId is optional
  if (!user.openId && !user.email) {
    throw new Error("User openId or email is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      name: user.name || '',
      email: user.email || '',
      ...(user.openId && { openId: user.openId }),
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["loginMethod", "password"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Learning Paths =====

export async function getAllLearningPaths() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(learningPaths).where(eq(learningPaths.isPublished, true)).orderBy(asc(learningPaths.order));
}

export async function getLearningPathBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(learningPaths).where(eq(learningPaths.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function enrollInPath(userId: number, pathId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Check if already enrolled
  const existing = await db.select().from(pathEnrollments)
    .where(and(eq(pathEnrollments.userId, userId), eq(pathEnrollments.pathId, pathId)))
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0];
  }
  
  // Enroll user
  await db.insert(pathEnrollments).values({
    userId,
    pathId,
    progressPercent: 0,
  });
  
  const result = await db.select().from(pathEnrollments)
    .where(and(eq(pathEnrollments.userId, userId), eq(pathEnrollments.pathId, pathId)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getEnrolledPaths(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const enrollments = await db.select()
    .from(pathEnrollments)
    .where(eq(pathEnrollments.userId, userId))
    .orderBy(desc(pathEnrollments.enrolledAt));
  
  // Get path details for each enrollment
  const pathIds = enrollments.map(e => e.pathId);
  const paths = await db.select().from(learningPaths).where(eq(learningPaths.isPublished, true));
  
  return enrollments.map(enrollment => {
    const path = paths.find(p => p.id === enrollment.pathId);
    return {
      ...enrollment,
      path,
    };
  }).filter(e => e.path); // Filter out paths that don't exist
}

export async function getEnrollmentStatus(userId: number, pathId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(pathEnrollments)
    .where(and(eq(pathEnrollments.userId, userId), eq(pathEnrollments.pathId, pathId)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

// ===== Modules =====

export async function getModulesByPathId(pathId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(modules).where(
    and(eq(modules.pathId, pathId), eq(modules.isPublished, true))
  ).orderBy(asc(modules.order));
}

export async function getModuleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(modules).where(eq(modules.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getModuleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(modules).where(eq(modules.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== User Progress =====

export async function getUserProgress(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(userProgress).where(
    and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId))
  ).limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

export async function upsertUserProgress(progress: InsertUserProgress) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userProgress).values(progress).onDuplicateKeyUpdate({
    set: {
      status: progress.status,
      progressPercent: progress.progressPercent,
      completedAt: progress.completedAt,
      lastAccessedAt: new Date(),
    },
  });
}

// ===== Quizzes =====

export async function getQuizByModuleId(moduleId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(quizzes).where(eq(quizzes.moduleId, moduleId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getQuizById(quizId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getQuizQuestions(quizId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(asc(quizQuestions.order));
}

export async function saveQuizAttempt(attempt: InsertQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(quizAttempts).values(attempt);
  return Number(result[0].insertId);
}

export async function getUserQuizAttempts(userId: number, quizId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(quizAttempts).where(
    and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId))
  ).orderBy(desc(quizAttempts.completedAt));
}

// ===== Resources =====

export async function getAllResources() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(resources).where(eq(resources.isPublished, true)).orderBy(desc(resources.createdAt));
}

export async function getResourceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Bookmarks =====

export async function getUserBookmarks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(bookmarks).where(eq(bookmarks.userId, userId)).orderBy(desc(bookmarks.createdAt));
}

export async function addBookmark(bookmark: InsertBookmark) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(bookmarks).values(bookmark);
}

export async function removeBookmark(userId: number, itemType: "module" | "resource", itemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(bookmarks).where(
    and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.itemType, itemType),
      eq(bookmarks.itemId, itemId)
    )
  );
}

export async function checkBookmark(userId: number, itemType: "module" | "resource", itemId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(bookmarks).where(
    and(
      eq(bookmarks.userId, userId),
      eq(bookmarks.itemType, itemType),
      eq(bookmarks.itemId, itemId)
    )
  ).limit(1);
  
  return result.length > 0;
}

// Certificate functions
export async function createCertificate(userId: number, pathId: number, certificateNumber: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create certificate: database not available");
    return undefined;
  }

  const result = await db.insert(certificates).values({
    userId,
    pathId,
    certificateNumber,
  });

  return result;
}

export async function getCertificate(userId: number, pathId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get certificate: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(certificates)
    .where(and(
      eq(certificates.userId, userId),
      eq(certificates.pathId, pathId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getCertificateByNumber(certificateNumber: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get certificate: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.certificateNumber, certificateNumber))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Module Notes functions
export async function createModuleNote(note: InsertModuleNote) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create note: database not available");
    return undefined;
  }

  const result = await db.insert(moduleNotes).values(note);
  return result;
}

export async function updateModuleNote(id: number, content: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update note: database not available");
    return undefined;
  }

  await db
    .update(moduleNotes)
    .set({ content, updatedAt: new Date() })
    .where(eq(moduleNotes.id, id));
  
  return { success: true };
}

export async function deleteModuleNote(id: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete note: database not available");
    return undefined;
  }

  await db
    .delete(moduleNotes)
    .where(and(
      eq(moduleNotes.id, id),
      eq(moduleNotes.userId, userId)
    ));
  
  return { success: true };
}

export async function getModuleNotes(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get notes: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(moduleNotes)
    .where(and(
      eq(moduleNotes.userId, userId),
      eq(moduleNotes.moduleId, moduleId)
    ))
    .orderBy(desc(moduleNotes.createdAt));

  return result;
}

export async function getAllUserNotes(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get notes: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(moduleNotes)
    .where(eq(moduleNotes.userId, userId))
    .orderBy(desc(moduleNotes.createdAt));

  return result;
}
