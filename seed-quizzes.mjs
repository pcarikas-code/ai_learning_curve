import { drizzle } from "drizzle-orm/mysql2";
import { quizzes, quizQuestions, modules } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

// Quiz data for all modules
const quizData = [
  // AI Fundamentals - What is AI
  {
    moduleSlug: "what-is-ai",
    title: "Introduction to AI Quiz",
    description: "Test your understanding of AI fundamentals",
    passingScore: 70,
    questions: [
      {
        question: "What is the primary goal of Artificial Intelligence?",
        options: ["To replace all human jobs", "To create machines that can perform tasks requiring human intelligence", "To build robots only", "To make computers faster"],
        correctAnswer: 1,
        explanation: "AI aims to create systems that can perform tasks that typically require human intelligence, such as learning, reasoning, and problem-solving."
      },
      {
        question: "Which of the following is NOT a type of AI?",
        options: ["Narrow AI", "General AI", "Super AI", "Quantum AI"],
        correctAnswer: 3,
        explanation: "Narrow AI, General AI, and Super AI are the three main types of AI. Quantum AI is not a recognized AI type category."
      },
      {
        question: "What does 'Machine Learning' refer to?",
        options: ["Teaching machines to move", "A subset of AI where systems learn from data", "Programming robots", "Building computer hardware"],
        correctAnswer: 1,
        explanation: "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed."
      }
    ]
  },
  // AI Fundamentals - Types
  {
    moduleSlug: "types-of-ai",
    title: "History of AI Quiz",
    description: "Test your knowledge of AI history",
    passingScore: 70,
    questions: [
      {
        question: "When was the term 'Artificial Intelligence' first coined?",
        options: ["1936", "1950", "1956", "1970"],
        correctAnswer: 2,
        explanation: "The term 'Artificial Intelligence' was coined at the Dartmouth Conference in 1956 by John McCarthy."
      },
      {
        question: "Who is considered the father of AI?",
        options: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Herbert Simon"],
        correctAnswer: 1,
        explanation: "John McCarthy is widely considered the father of AI for coining the term and organizing the Dartmouth Conference."
      },
      {
        question: "What test did Alan Turing propose to measure machine intelligence?",
        options: ["IQ Test", "Turing Test", "Logic Test", "Memory Test"],
        correctAnswer: 1,
        explanation: "The Turing Test, proposed by Alan Turing in 1950, evaluates a machine's ability to exhibit intelligent behavior indistinguishable from a human."
      }
    ]
  },
  // Machine Learning - Introduction
  {
    moduleSlug: "ml-introduction",
    title: "Introduction to Machine Learning Quiz",
    description: "Test your understanding of ML basics",
    passingScore: 70,
    questions: [
      {
        question: "What are the three main types of machine learning?",
        options: ["Fast, Medium, Slow", "Supervised, Unsupervised, Reinforcement", "Simple, Complex, Advanced", "Linear, Non-linear, Hybrid"],
        correctAnswer: 1,
        explanation: "The three main types of machine learning are Supervised Learning, Unsupervised Learning, and Reinforcement Learning."
      },
      {
        question: "In supervised learning, what is provided to the algorithm?",
        options: ["Only input data", "Only output data", "Labeled data with inputs and outputs", "Random data"],
        correctAnswer: 2,
        explanation: "Supervised learning requires labeled data where both inputs and their corresponding correct outputs are provided for training."
      },
      {
        question: "Which task is an example of unsupervised learning?",
        options: ["Email spam detection", "Customer segmentation", "House price prediction", "Image classification"],
        correctAnswer: 1,
        explanation: "Customer segmentation is unsupervised learning as it finds patterns in data without predefined labels."
      }
    ]
  },
  // Deep Learning - Neural Networks
  {
    moduleSlug: "dl-neural-networks-intro",
    title: "Neural Networks Basics Quiz",
    description: "Test your knowledge of neural networks",
    passingScore: 70,
    questions: [
      {
        question: "What is a perceptron?",
        options: ["A type of computer", "The simplest form of a neural network", "A programming language", "A data structure"],
        correctAnswer: 1,
        explanation: "A perceptron is the simplest form of a neural network, consisting of a single neuron that makes binary decisions."
      },
      {
        question: "What is the purpose of an activation function?",
        options: ["To speed up training", "To introduce non-linearity", "To reduce memory usage", "To visualize data"],
        correctAnswer: 1,
        explanation: "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns."
      },
      {
        question: "What does 'backpropagation' do?",
        options: ["Moves data backward", "Calculates gradients to update weights", "Deletes old data", "Creates new neurons"],
        correctAnswer: 1,
        explanation: "Backpropagation calculates gradients of the loss function and propagates them backward to update network weights."
      }
    ]
  },
  // NLP - Introduction
  {
    moduleSlug: "nlp-introduction",
    title: "Introduction to NLP Quiz",
    description: "Test your understanding of NLP fundamentals",
    passingScore: 70,
    questions: [
      {
        question: "What does NLP stand for?",
        options: ["Natural Language Processing", "Neural Learning Protocol", "Network Layer Protocol", "New Learning Platform"],
        correctAnswer: 0,
        explanation: "NLP stands for Natural Language Processing, the field of AI focused on enabling computers to understand and generate human language."
      },
      {
        question: "Which of the following is an NLP task?",
        options: ["Image recognition", "Sentiment analysis", "Video compression", "Audio mixing"],
        correctAnswer: 1,
        explanation: "Sentiment analysis is a core NLP task that determines the emotional tone of text."
      },
      {
        question: "What is tokenization in NLP?",
        options: ["Encrypting text", "Breaking text into smaller units", "Translating languages", "Compressing files"],
        correctAnswer: 1,
        explanation: "Tokenization is the process of breaking text into smaller units (tokens) such as words or subwords for processing."
      }
    ]
  },
  // Computer Vision - Introduction
  {
    moduleSlug: "cv-introduction",
    title: "Introduction to Computer Vision Quiz",
    description: "Test your knowledge of computer vision basics",
    passingScore: 70,
    questions: [
      {
        question: "What is the primary goal of computer vision?",
        options: ["To improve monitor displays", "To enable computers to interpret visual information", "To create graphics", "To compress images"],
        correctAnswer: 1,
        explanation: "Computer vision aims to enable computers to interpret and understand visual information from the world, similar to human vision."
      },
      {
        question: "Which of the following is a computer vision task?",
        options: ["Text translation", "Object detection", "Speech recognition", "Music generation"],
        correctAnswer: 1,
        explanation: "Object detection is a fundamental computer vision task that identifies and locates objects within images or videos."
      },
      {
        question: "What are CNNs particularly good at?",
        options: ["Text processing", "Image recognition", "Audio analysis", "Database queries"],
        correctAnswer: 1,
        explanation: "Convolutional Neural Networks (CNNs) are specifically designed for image recognition and processing tasks."
      }
    ]
  }
];

async function seedQuizzes() {
  console.log("Starting quiz seeding...");

  // Get all modules to map slugs to IDs
  const allModules = await db.select().from(modules);
  const moduleMap = new Map(allModules.map(m => [m.slug, m.id]));

  for (const quizItem of quizData) {
    const moduleId = moduleMap.get(quizItem.moduleSlug);
    
    if (!moduleId) {
      console.log(`Module not found for slug: ${quizItem.moduleSlug}, skipping...`);
      continue;
    }

    // Check if quiz already exists
    const existingQuiz = await db.select().from(quizzes).where(eq(quizzes.moduleId, moduleId)).limit(1);

    if (existingQuiz.length > 0) {
      console.log(`Quiz already exists for module: ${quizItem.moduleSlug}, skipping...`);
      continue;
    }

    // Insert quiz
    const [quizResult] = await db.insert(quizzes).values({
      moduleId,
      title: quizItem.title,
      description: quizItem.description,
      passingScore: quizItem.passingScore,
      timeLimit: 10, // 10 minutes
    });

    const quizId = quizResult.insertId;
    console.log(`Created quiz: ${quizItem.title} (ID: ${quizId})`);

    // Insert questions
    for (let i = 0; i < quizItem.questions.length; i++) {
      const q = quizItem.questions[i];
      await db.insert(quizQuestions).values({
        quizId,
        question: q.question,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        order: i + 1,
      });
    }

    console.log(`Added ${quizItem.questions.length} questions to quiz ${quizId}`);
  }

  console.log("Quiz seeding completed!");
}

seedQuizzes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding quizzes:", error);
    process.exit(1);
  });
