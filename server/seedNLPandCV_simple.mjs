import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

async function seed() {
  console.log("Seeding NLP and CV modules (without quizzes)...");

  const nlpModules = [
    {
      path_id: 4,
      title: "Introduction to NLP",
      slug: "intro-to-nlp",
      description: "Understanding natural language processing fundamentals, applications, and the NLP pipeline.",
      content: "# Introduction to Natural Language Processing\n\nNLP enables computers to understand, interpret, and generate human language.",
      difficulty: "beginner",
      estimated_minutes: 45,
      order: 1,
      is_published: 1,
    },
    {
      path_id: 4,
      title: "Text Preprocessing & Tokenization",
      slug: "text-preprocessing-tokenization",
      description: "Learn text cleaning, normalization, and tokenization techniques.",
      content: "# Text Preprocessing & Tokenization\n\nBefore feeding text to NLP models, we must clean and structure it.",
      difficulty: "beginner",
      estimated_minutes: 60,
      order: 2,
      is_published: 1,
    },
  ];

  const cvModules = [
    {
      path_id: 5,
      title: "Introduction to Computer Vision",
      slug: "intro-to-cv",
      description: "Understanding computer vision fundamentals and image representation.",
      content: "# Introduction to Computer Vision\n\nCV enables machines to interpret and understand visual information.",
      difficulty: "beginner",
      estimated_minutes: 50,
      order: 1,
      is_published: 1,
    },
    {
      path_id: 5,
      title: "Convolutional Neural Networks",
      slug: "convolutional-neural-networks",
      description: "Learn CNN architecture and building image classifiers.",
      content: "# Convolutional Neural Networks\n\nCNNs are the backbone of modern computer vision.",
      difficulty: "intermediate",
      estimated_minutes: 90,
      order: 2,
      is_published: 1,
    },
  ];

  const allModules = [...nlpModules, ...cvModules];

  for (const mod of allModules) {
    const [result] = await pool.query(
      `INSERT INTO modules (path_id, title, slug, description, content, difficulty, estimated_minutes, \`order\`, is_published) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [mod.path_id, mod.title, mod.slug, mod.description, mod.content, mod.difficulty, mod.estimated_minutes, mod.order, mod.is_published]
    );
    console.log(`✓ Inserted: ${mod.title} (ID: ${result.insertId})`);
  }

  console.log("✅ Modules seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
