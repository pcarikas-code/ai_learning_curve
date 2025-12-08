import { getDb } from "./db";
import {
  achievements,
  userAchievements,
  userProgress,
  quizAttempts,
  certificates,
  moduleNotes,
  users,
} from "../drizzle/schema";
import { eq, and, sql, count } from "drizzle-orm";

export interface AchievementCheckResult {
  earned: boolean;
  achievement?: any;
  isNew?: boolean;
}

/**
 * Check if user has earned a specific achievement
 */
export async function checkAchievement(
  userId: number,
  achievementKey: string
): Promise<AchievementCheckResult> {
  const db = await getDb();
  if (!db) return { earned: false };

  // Get achievement definition
  const [achievement] = await db
    .select()
    .from(achievements)
    .where(eq(achievements.key, achievementKey))
    .limit(1);

  if (!achievement) return { earned: false };

  // Check if user already has this achievement
  const [existing] = await db
    .select()
    .from(userAchievements)
    .where(
      and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievement.id)
      )
    )
    .limit(1);

  if (existing) {
    return { earned: true, achievement, isNew: false };
  }

  // Parse criteria and check if met
  const criteria = JSON.parse(achievement.criteria);
  const met = await checkCriteria(userId, criteria);

  if (met) {
    // Award achievement
    await db.insert(userAchievements).values({
      userId,
      achievementId: achievement.id,
    });

    return { earned: true, achievement, isNew: true };
  }

  return { earned: false };
}

/**
 * Check all achievements for a user and award any newly earned ones
 */
export async function checkAllAchievements(userId: number): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  // Get all active achievements
  const allAchievements = await db
    .select()
    .from(achievements)
    .where(eq(achievements.isActive, true));

  const newlyEarned = [];

  for (const achievement of allAchievements) {
    const result = await checkAchievement(userId, achievement.key);
    if (result.isNew) {
      newlyEarned.push(result.achievement);
    }
  }

  return newlyEarned;
}

/**
 * Check if criteria is met for a specific achievement
 */
async function checkCriteria(userId: number, criteria: any): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  switch (criteria.type) {
    case "module_completion": {
      const [result] = await db
        .select({ count: count() })
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.status, "completed")
          )
        );
      return (result?.count || 0) >= criteria.count;
    }

    case "quiz_passed": {
      const [result] = await db
        .select({ count: count() })
        .from(quizAttempts)
        .where(
          and(eq(quizAttempts.userId, userId), eq(quizAttempts.passed, true))
        );
      return (result?.count || 0) >= criteria.count;
    }

    case "quiz_perfect": {
      const [result] = await db
        .select({ count: count() })
        .from(quizAttempts)
        .where(
          and(eq(quizAttempts.userId, userId), eq(quizAttempts.score, 100))
        );
      return (result?.count || 0) >= criteria.count;
    }

    case "path_completion": {
      const [result] = await db
        .select({ count: count() })
        .from(certificates)
        .where(eq(certificates.userId, userId));
      return (result?.count || 0) >= criteria.count;
    }

    case "specific_path": {
      // Check if user has certificate for specific path
      const [certificate] = await db
        .select()
        .from(certificates)
        .innerJoin(
          sql`learning_paths`,
          sql`certificates.pathId = learning_paths.id`
        )
        .where(
          and(
            eq(certificates.userId, userId),
            sql`learning_paths.slug = ${criteria.pathSlug}`
          )
        )
        .limit(1);
      return !!certificate;
    }

    case "onboarding_complete": {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return user?.onboardingCompleted === 1;
    }

    case "note_created": {
      const [result] = await db
        .select({ count: count() })
        .from(moduleNotes)
        .where(eq(moduleNotes.userId, userId));
      return (result?.count || 0) >= criteria.count;
    }

    case "certificate_earned": {
      const [result] = await db
        .select({ count: count() })
        .from(certificates)
        .where(eq(certificates.userId, userId));
      return (result?.count || 0) >= criteria.count;
    }

    default:
      return false;
  }
}

/**
 * Get all achievements earned by a user
 */
export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const earned = await db
    .select({
      id: userAchievements.id,
      earnedAt: userAchievements.earnedAt,
      achievement: achievements,
    })
    .from(userAchievements)
    .innerJoin(
      achievements,
      eq(userAchievements.achievementId, achievements.id)
    )
    .where(eq(userAchievements.userId, userId))
    .orderBy(sql`${userAchievements.earnedAt} DESC`);

  return earned;
}

/**
 * Get achievement progress for a user
 */
export async function getAchievementProgress(userId: number) {
  const db = await getDb();
  if (!db) return { total: 0, earned: 0, points: 0 };

  const [totalAchievements] = await db
    .select({ count: count() })
    .from(achievements)
    .where(eq(achievements.isActive, true));

  const [earnedAchievements] = await db
    .select({ count: count() })
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  const [pointsResult] = await db
    .select({ total: sql<number>`SUM(${achievements.points})` })
    .from(userAchievements)
    .innerJoin(
      achievements,
      eq(userAchievements.achievementId, achievements.id)
    )
    .where(eq(userAchievements.userId, userId));

  return {
    total: totalAchievements?.count || 0,
    earned: earnedAchievements?.count || 0,
    points: pointsResult?.total || 0,
  };
}
