import { getDb } from "./db";
import { learningPaths, modules, quizzes, quizQuestions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seedNLPandCV() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  console.log("Seeding NLP and Computer Vision modules...");

  // Get existing paths
  const paths = await db.select().from(learningPaths);
  const pathMap = new Map(paths.map(p => [p.slug, p.id]));

  const nlpId = pathMap.get("natural-language-processing")!;
  const cvId = pathMap.get("computer-vision")!;

  console.log(`NLP Path ID: ${nlpId}, CV Path ID: ${cvId}`);

  // Just insert 2 modules for each path as a test
  const testModules = [
    {
      pathId: nlpId,
      title: "Introduction to NLP",
      slug: "intro-to-nlp",
      description: "Understanding natural language processing fundamentals.",
      content: "# Introduction to NLP\n\nNLP enables computers to understand human language.",
      difficulty: "beginner" as const,
      estimatedMinutes: 45,
      order: 1,
      isPublished: true,
    },
    {
      pathId: cvId,
      title: "Introduction to Computer Vision",
      slug: "intro-to-cv",
      description: "Understanding computer vision fundamentals.",
      content: "# Introduction to Computer Vision\n\nCV enables machines to interpret visual information.",
      difficulty: "beginner" as const,
      estimatedMinutes: 50,
      order: 1,
      isPublished: true,
    },
  ];

  for (const module of testModules) {
    const [result] = await db.insert(modules).values(module);
    console.log(`✓ Inserted: ${module.title} (ID: ${result.insertId})`);
  }

  console.log("✅ Test modules seeded successfully!");
}

seedNLPandCV().catch(console.error);
