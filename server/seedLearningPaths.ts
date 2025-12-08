import { getDb } from "./db";
import { learningPaths, modules } from "../drizzle/schema";

async function seedLearningPaths() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  console.log("Seeding learning paths...");

  // Insert learning paths
  const paths = [
    {
      title: "AI Fundamentals",
      slug: "ai-fundamentals",
      description: "Master the core concepts of Artificial Intelligence, from basic terminology to fundamental algorithms. Perfect for beginners starting their AI journey.",
      difficulty: "beginner" as const,
      estimatedHours: 20,
      icon: "Brain",
      color: "blue",
      order: 1,
      isPublished: true,
    },
    {
      title: "Machine Learning Essentials",
      slug: "machine-learning-essentials",
      description: "Dive deep into machine learning algorithms, supervised and unsupervised learning, and practical applications. Build your first ML models.",
      difficulty: "intermediate" as const,
      estimatedHours: 35,
      icon: "Cpu",
      color: "green",
      order: 2,
      isPublished: true,
    },
    {
      title: "Deep Learning & Neural Networks",
      slug: "deep-learning-neural-networks",
      description: "Explore the world of deep learning, neural network architectures, CNNs, RNNs, and transformers. Learn to build advanced AI models.",
      difficulty: "advanced" as const,
      estimatedHours: 45,
      icon: "Network",
      color: "purple",
      order: 3,
      isPublished: true,
    },
    {
      title: "Natural Language Processing",
      slug: "natural-language-processing",
      description: "Learn how AI understands and generates human language. Cover text processing, sentiment analysis, and language models like GPT.",
      difficulty: "intermediate" as const,
      estimatedHours: 30,
      icon: "MessageSquare",
      color: "orange",
      order: 4,
      isPublished: true,
    },
    {
      title: "Computer Vision",
      slug: "computer-vision",
      description: "Discover how AI sees and interprets images and videos. Learn object detection, image classification, and facial recognition techniques.",
      difficulty: "advanced" as const,
      estimatedHours: 40,
      icon: "Eye",
      color: "red",
      order: 5,
      isPublished: true,
    },
  ];

  for (const path of paths) {
    await db.insert(learningPaths).values(path);
    console.log(`✓ Seeded learning path: ${path.title}`);
  }

  // Get the inserted path IDs
  const insertedPaths = await db.select().from(learningPaths);
  const pathMap = new Map(insertedPaths.map(p => [p.slug, p.id]));

  // Insert modules for AI Fundamentals
  const aiFundamentalsId = pathMap.get("ai-fundamentals")!;
  const aiFundamentalsModules = [
    {
      pathId: aiFundamentalsId,
      title: "Introduction to Artificial Intelligence",
      slug: "intro-to-ai",
      description: "Understand what AI is, its history, and its impact on modern society.",
      content: "# Introduction to Artificial Intelligence\n\nArtificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems...",
      difficulty: "beginner" as const,
      estimatedMinutes: 45,
      order: 1,
      isPublished: true,
    },
    {
      pathId: aiFundamentalsId,
      title: "Types of AI: Narrow vs General",
      slug: "types-of-ai",
      description: "Learn about different categories of AI and their capabilities.",
      content: "# Types of AI\n\nAI can be categorized into Narrow AI (Weak AI) and General AI (Strong AI)...",
      difficulty: "beginner" as const,
      estimatedMinutes: 40,
      order: 2,
      isPublished: true,
    },
    {
      pathId: aiFundamentalsId,
      title: "Key AI Concepts and Terminology",
      slug: "ai-concepts-terminology",
      description: "Master essential AI vocabulary and fundamental concepts.",
      content: "# Key AI Concepts\n\nUnderstanding AI requires familiarity with key terms like algorithms, training data, models, and inference...",
      difficulty: "beginner" as const,
      estimatedMinutes: 50,
      order: 3,
      isPublished: true,
    },
  ];

  // Insert modules for Machine Learning Essentials
  const mlEssentialsId = pathMap.get("machine-learning-essentials")!;
  const mlEssentialsModules = [
    {
      pathId: mlEssentialsId,
      title: "What is Machine Learning?",
      slug: "what-is-ml",
      description: "Introduction to machine learning and how it differs from traditional programming.",
      content: "# What is Machine Learning?\n\nMachine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed...",
      difficulty: "intermediate" as const,
      estimatedMinutes: 60,
      order: 1,
      isPublished: true,
    },
    {
      pathId: mlEssentialsId,
      title: "Supervised Learning",
      slug: "supervised-learning",
      description: "Learn about classification and regression algorithms.",
      content: "# Supervised Learning\n\nSupervised learning uses labeled training data to learn the mapping between inputs and outputs...",
      difficulty: "intermediate" as const,
      estimatedMinutes: 75,
      order: 2,
      isPublished: true,
    },
    {
      pathId: mlEssentialsId,
      title: "Unsupervised Learning",
      slug: "unsupervised-learning",
      description: "Explore clustering, dimensionality reduction, and pattern discovery.",
      content: "# Unsupervised Learning\n\nUnsupervised learning finds hidden patterns in data without labeled examples...",
      difficulty: "intermediate" as const,
      estimatedMinutes: 70,
      order: 3,
      isPublished: true,
    },
  ];

  // Insert all modules
  const allModules = [...aiFundamentalsModules, ...mlEssentialsModules];
  for (const module of allModules) {
    await db.insert(modules).values(module);
    console.log(`✓ Seeded module: ${module.title}`);
  }

  console.log("\n✅ Learning paths and modules seeded successfully!");
}

seedLearningPaths().catch(console.error);
