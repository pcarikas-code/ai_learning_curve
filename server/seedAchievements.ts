import { getDb } from "./db";
import { achievements } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const achievementDefinitions = [
  // Module Achievements
  {
    key: "first_steps",
    title: "First Steps",
    description: "Complete your first module",
    icon: "Footprints",
    category: "module" as const,
    criteria: JSON.stringify({ type: "module_completion", count: 1 }),
    points: 10,
    rarity: "common" as const,
  },
  {
    key: "knowledge_seeker",
    title: "Knowledge Seeker",
    description: "Complete 5 modules",
    icon: "BookOpen",
    category: "module" as const,
    criteria: JSON.stringify({ type: "module_completion", count: 5 }),
    points: 25,
    rarity: "common" as const,
  },
  {
    key: "dedicated_learner",
    title: "Dedicated Learner",
    description: "Complete 10 modules",
    icon: "GraduationCap",
    category: "module" as const,
    criteria: JSON.stringify({ type: "module_completion", count: 10 }),
    points: 50,
    rarity: "rare" as const,
  },
  {
    key: "master_student",
    title: "Master Student",
    description: "Complete 25 modules",
    icon: "Award",
    category: "module" as const,
    criteria: JSON.stringify({ type: "module_completion", count: 25 }),
    points: 100,
    rarity: "epic" as const,
  },

  // Quiz Achievements
  {
    key: "quiz_novice",
    title: "Quiz Novice",
    description: "Pass your first quiz",
    icon: "CheckCircle",
    category: "quiz" as const,
    criteria: JSON.stringify({ type: "quiz_passed", count: 1 }),
    points: 10,
    rarity: "common" as const,
  },
  {
    key: "perfect_score",
    title: "Perfect Score",
    description: "Get 100% on any quiz",
    icon: "Star",
    category: "quiz" as const,
    criteria: JSON.stringify({ type: "quiz_perfect", count: 1 }),
    points: 30,
    rarity: "rare" as const,
  },
  {
    key: "quiz_master",
    title: "Quiz Master",
    description: "Get perfect scores on 5 quizzes",
    icon: "Trophy",
    category: "quiz" as const,
    criteria: JSON.stringify({ type: "quiz_perfect", count: 5 }),
    points: 75,
    rarity: "epic" as const,
  },
  {
    key: "flawless_victory",
    title: "Flawless Victory",
    description: "Get perfect scores on 10 quizzes",
    icon: "Crown",
    category: "quiz" as const,
    criteria: JSON.stringify({ type: "quiz_perfect", count: 10 }),
    points: 150,
    rarity: "legendary" as const,
  },

  // Path Achievements
  {
    key: "path_pioneer",
    title: "Path Pioneer",
    description: "Complete your first learning path",
    icon: "Map",
    category: "path" as const,
    criteria: JSON.stringify({ type: "path_completion", count: 1 }),
    points: 50,
    rarity: "rare" as const,
  },
  {
    key: "ai_fundamentals_master",
    title: "AI Fundamentals Master",
    description: "Complete the AI Fundamentals learning path",
    icon: "Brain",
    category: "path" as const,
    criteria: JSON.stringify({ type: "specific_path", pathSlug: "ai-fundamentals" }),
    points: 50,
    rarity: "rare" as const,
  },
  {
    key: "ml_expert",
    title: "Machine Learning Expert",
    description: "Complete the Machine Learning learning path",
    icon: "Cpu",
    category: "path" as const,
    criteria: JSON.stringify({ type: "specific_path", pathSlug: "machine-learning" }),
    points: 75,
    rarity: "epic" as const,
  },
  {
    key: "deep_learning_guru",
    title: "Deep Learning Guru",
    description: "Complete the Deep Learning learning path",
    icon: "Network",
    category: "path" as const,
    criteria: JSON.stringify({ type: "specific_path", pathSlug: "deep-learning" }),
    points: 100,
    rarity: "epic" as const,
  },
  {
    key: "nlp_specialist",
    title: "NLP Specialist",
    description: "Complete the Natural Language Processing learning path",
    icon: "MessageSquare",
    category: "path" as const,
    criteria: JSON.stringify({ type: "specific_path", pathSlug: "natural-language-processing" }),
    points: 100,
    rarity: "epic" as const,
  },
  {
    key: "vision_master",
    title: "Computer Vision Master",
    description: "Complete the Computer Vision learning path",
    icon: "Eye",
    category: "path" as const,
    criteria: JSON.stringify({ type: "specific_path", pathSlug: "computer-vision" }),
    points: 100,
    rarity: "epic" as const,
  },
  {
    key: "polymath",
    title: "AI Polymath",
    description: "Complete all learning paths",
    icon: "Sparkles",
    category: "path" as const,
    criteria: JSON.stringify({ type: "path_completion", count: 5 }),
    points: 250,
    rarity: "legendary" as const,
  },

  // Special Achievements
  {
    key: "early_bird",
    title: "Early Bird",
    description: "Complete the onboarding process",
    icon: "Sunrise",
    category: "special" as const,
    criteria: JSON.stringify({ type: "onboarding_complete" }),
    points: 5,
    rarity: "common" as const,
  },
  {
    key: "note_taker",
    title: "Note Taker",
    description: "Create your first module note",
    icon: "FileText",
    category: "special" as const,
    criteria: JSON.stringify({ type: "note_created", count: 1 }),
    points: 10,
    rarity: "common" as const,
  },
  {
    key: "certificate_collector",
    title: "Certificate Collector",
    description: "Earn your first certificate",
    icon: "Award",
    category: "special" as const,
    criteria: JSON.stringify({ type: "certificate_earned", count: 1 }),
    points: 50,
    rarity: "rare" as const,
  },
];

export async function seedAchievements() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("Seeding achievements...");

  for (const achievement of achievementDefinitions) {
    try {
      // Check if achievement already exists
      const existing = await db
        .select()
        .from(achievements)
        .where(eq(achievements.key, achievement.key))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(achievements).values(achievement);
        console.log(`✓ Created achievement: ${achievement.title}`);
      } else {
        console.log(`- Achievement already exists: ${achievement.title}`);
      }
    } catch (error) {
      console.error(`✗ Error creating achievement ${achievement.title}:`, error);
    }
  }

  console.log("Achievement seeding complete!");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAchievements()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
