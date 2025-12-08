import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Made optional for email/password auth
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(), // Made required and unique
  password: varchar("password", { length: 255 }), // Hashed password for email/password auth
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  onboardingCompleted: int("onboardingCompleted").default(0).notNull(), // 0 = not started, 1 = completed
  experienceLevel: varchar("experienceLevel", { length: 50 }), // beginner, intermediate, advanced
  learningGoals: text("learningGoals"), // JSON array of goals
  interests: text("interests"), // JSON array of interest areas
  emailVerified: int("emailVerified").default(0).notNull(), // 0 = not verified, 1 = verified
  emailVerificationToken: varchar("emailVerificationToken", { length: 255 }), // Token for email verification
  emailVerificationExpiry: timestamp("emailVerificationExpiry"), // Expiry time for verification token
  passwordResetToken: varchar("passwordResetToken", { length: 255 }), // Token for password reset
  passwordResetExpiry: timestamp("passwordResetExpiry"), // Expiry time for reset token
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Module notes table for user's personal learning notes
 */
export const moduleNotes = mysqlTable("module_notes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  moduleId: int("module_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ModuleNote = typeof moduleNotes.$inferSelect;
export type InsertModuleNote = typeof moduleNotes.$inferInsert;

// TODO: Add your tables here

export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  pathId: int("pathId").notNull(),
  certificateNumber: varchar("certificateNumber", { length: 64 }).notNull().unique(),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Path enrollment tracking
 */
export const pathEnrollments = mysqlTable("path_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  pathId: int("path_id").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  progressPercent: int("progress_percent").default(0).notNull(),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type PathEnrollment = typeof pathEnrollments.$inferSelect;
export type InsertPathEnrollment = typeof pathEnrollments.$inferInsert;

// TODO: Add your tables here
export const learningPaths = mysqlTable("learning_paths", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull(),
  estimatedHours: int("estimated_hours"),
  icon: varchar("icon", { length: 100 }),
  color: varchar("color", { length: 50 }),
  order: int("order").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = typeof learningPaths.$inferInsert;

/**
 * Individual learning modules within paths
 */
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  pathId: int("path_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content").notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull(),
  estimatedMinutes: int("estimated_minutes"),
  order: int("order").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

/**
 * User progress tracking for modules
 */
export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  moduleId: int("module_id").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  progressPercent: int("progress_percent").default(0).notNull(),
  timeSpentMinutes: int("time_spent_minutes").default(0).notNull(),
  lastAccessedAt: timestamp("last_accessed_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Quizzes for modules
 */
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("module_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  passingScore: int("passing_score").default(70).notNull(),
  timeLimit: int("time_limit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

/**
 * Quiz questions
 */
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quiz_id").notNull(),
  question: text("question").notNull(),
  questionType: mysqlEnum("question_type", ["multiple_choice", "true_false", "code"]).default("multiple_choice").notNull(),
  options: text("options"),
  correctAnswer: int("correct_answer").notNull(),
  explanation: text("explanation"),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/**
 * User quiz attempts
 */
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  quizId: int("quiz_id").notNull(),
  score: int("score").notNull(),
  answers: text("answers").notNull(),
  passed: boolean("passed").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

/**
 * Learning resources (articles, videos, tools, etc.)
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 500 }),
  resourceType: mysqlEnum("resource_type", ["article", "video", "tool", "course", "book", "documentation"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]),
  tags: text("tags"),
  isPremium: boolean("is_premium").default(false).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * User bookmarks for modules and resources
 */
export const bookmarks = mysqlTable("bookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  itemType: mysqlEnum("item_type", ["module", "resource"]).notNull(),
  itemId: int("item_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = typeof bookmarks.$inferInsert;

/**
 * Achievement definitions
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }).notNull(),
  category: mysqlEnum("category", ["module", "quiz", "path", "streak", "special"]).notNull(),
  criteria: text("criteria").notNull(), // JSON with achievement criteria
  points: int("points").default(10).notNull(),
  rarity: mysqlEnum("rarity", ["common", "rare", "epic", "legendary"]).default("common").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User earned achievements
 */
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  achievementId: int("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  progress: int("progress").default(0).notNull(), // For tracking progress towards achievement
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
