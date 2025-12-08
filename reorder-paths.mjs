import { drizzle } from 'drizzle-orm/mysql2';
import { learningPaths } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

async function reorderPaths() {
  console.log("Reordering learning paths from beginner to advanced...");

  // Order: AI Fundamentals (1) → Machine Learning (2) → Deep Learning (3) → NLP (4) → Computer Vision (5)
  
  const paths = await db.select().from(learningPaths);
  
  // Update order for each path
  const aiFund = paths.find(p => p.slug === "ai-fundamentals");
  const ml = paths.find(p => p.slug === "machine-learning");
  const dl = paths.find(p => p.slug === "deep-learning");
  const nlp = paths.find(p => p.slug === "nlp");
  const cv = paths.find(p => p.slug === "computer-vision");

  if (aiFund) {
    await db.update(learningPaths)
      .set({ order: 1 })
      .where(eq(learningPaths.id, aiFund.id));
    console.log("Set AI Fundamentals to order 1");
  }

  if (ml) {
    await db.update(learningPaths)
      .set({ order: 2 })
      .where(eq(learningPaths.id, ml.id));
    console.log("Set Machine Learning to order 2");
  }

  if (dl) {
    await db.update(learningPaths)
      .set({ order: 3 })
      .where(eq(learningPaths.id, dl.id));
    console.log("Set Deep Learning to order 3");
  }

  if (nlp) {
    await db.update(learningPaths)
      .set({ order: 4 })
      .where(eq(learningPaths.id, nlp.id));
    console.log("Set NLP to order 4");
  }

  if (cv) {
    await db.update(learningPaths)
      .set({ order: 5 })
      .where(eq(learningPaths.id, cv.id));
    console.log("Set Computer Vision to order 5");
  }

  console.log("Reordering completed!");
}

reorderPaths()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
