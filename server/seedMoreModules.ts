import { getDb } from "./db";
import { learningPaths, modules, quizzes, quizQuestions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seedMoreModules() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    return;
  }

  console.log("Seeding additional modules and quizzes...");

  // Get existing paths
  const paths = await db.select().from(learningPaths);
  const pathMap = new Map(paths.map(p => [p.slug, p.id]));

  // AI Fundamentals - Additional Modules
  const aiFundamentalsId = pathMap.get("ai-fundamentals")!;
  const aiFundamentalsNewModules = [
    {
      pathId: aiFundamentalsId,
      title: "AI Applications in Daily Life",
      slug: "ai-applications-daily-life",
      description: "Discover how AI powers everyday technologies from smartphones to smart homes.",
      content: "# AI Applications in Daily Life\n\nAI is everywhere in modern life:\n\n## Virtual Assistants\n- Siri, Alexa, Google Assistant use natural language processing\n- Voice recognition and speech synthesis\n\n## Recommendation Systems\n- Netflix, Spotify, YouTube recommendations\n- E-commerce product suggestions\n\n## Smart Devices\n- Smart thermostats learning your preferences\n- Autonomous vacuum cleaners\n- Facial recognition on phones",
      difficulty: "beginner" as const,
      estimatedMinutes: 35,
      order: 4,
      isPublished: true,
    },
    {
      pathId: aiFundamentalsId,
      title: "Ethics and Bias in AI",
      slug: "ethics-bias-ai",
      description: "Understand the ethical considerations and potential biases in AI systems.",
      content: "# Ethics and Bias in AI\n\n## Why Ethics Matter\nAI systems can perpetuate and amplify human biases if not carefully designed.\n\n## Common Bias Sources\n1. **Training Data Bias**: Unrepresentative datasets\n2. **Algorithm Bias**: Flawed model design\n3. **Human Bias**: Developer assumptions\n\n## Ethical Principles\n- Fairness and non-discrimination\n- Transparency and explainability\n- Privacy and data protection\n- Accountability",
      difficulty: "beginner" as const,
      estimatedMinutes: 45,
      order: 5,
      isPublished: true,
    },
    {
      pathId: aiFundamentalsId,
      title: "The Future of AI",
      slug: "future-of-ai",
      description: "Explore emerging trends and future possibilities in artificial intelligence.",
      content: "# The Future of AI\n\n## Emerging Trends\n- **Artificial General Intelligence (AGI)**: AI with human-level intelligence\n- **Quantum AI**: Leveraging quantum computing\n- **Edge AI**: AI processing on devices\n- **Explainable AI (XAI)**: Making AI decisions transparent\n\n## Potential Impact\n- Healthcare: Personalized medicine, drug discovery\n- Climate: Environmental monitoring, optimization\n- Education: Adaptive learning systems\n- Transportation: Autonomous vehicles",
      difficulty: "beginner" as const,
      estimatedMinutes: 40,
      order: 6,
      isPublished: true,
    },
  ];

  // Machine Learning Essentials - Additional Modules
  const mlEssentialsId = pathMap.get("machine-learning-essentials")!;
  const mlEssentialsNewModules = [
    {
      pathId: mlEssentialsId,
      title: "Feature Engineering",
      slug: "feature-engineering",
      description: "Learn how to create and select features that improve model performance.",
      content: "# Feature Engineering\n\n## What is Feature Engineering?\nThe process of creating new features or transforming existing ones to improve model performance.\n\n## Common Techniques\n1. **Normalization**: Scaling features to similar ranges\n2. **One-Hot Encoding**: Converting categorical variables\n3. **Feature Creation**: Combining existing features\n4. **Dimensionality Reduction**: PCA, t-SNE\n\n## Example\n```python\nfrom sklearn.preprocessing import StandardScaler\n\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n```",
      difficulty: "intermediate" as const,
      estimatedMinutes: 65,
      order: 4,
      isPublished: true,
    },
    {
      pathId: mlEssentialsId,
      title: "Model Evaluation Metrics",
      slug: "model-evaluation-metrics",
      description: "Understand different metrics to evaluate machine learning models.",
      content: "# Model Evaluation Metrics\n\n## Classification Metrics\n- **Accuracy**: Correct predictions / Total predictions\n- **Precision**: True Positives / (True Positives + False Positives)\n- **Recall**: True Positives / (True Positives + False Negatives)\n- **F1 Score**: Harmonic mean of precision and recall\n\n## Regression Metrics\n- **MSE**: Mean Squared Error\n- **RMSE**: Root Mean Squared Error\n- **MAE**: Mean Absolute Error\n- **R² Score**: Coefficient of determination",
      difficulty: "intermediate" as const,
      estimatedMinutes: 55,
      order: 5,
      isPublished: true,
    },
    {
      pathId: mlEssentialsId,
      title: "Overfitting and Regularization",
      slug: "overfitting-regularization",
      description: "Learn how to prevent overfitting and improve model generalization.",
      content: "# Overfitting and Regularization\n\n## What is Overfitting?\nWhen a model learns training data too well, including noise, and performs poorly on new data.\n\n## Signs of Overfitting\n- High training accuracy, low test accuracy\n- Model too complex for the data\n\n## Regularization Techniques\n1. **L1 Regularization (Lasso)**: Adds absolute value of coefficients\n2. **L2 Regularization (Ridge)**: Adds squared value of coefficients\n3. **Dropout**: Randomly dropping neurons during training\n4. **Early Stopping**: Stop training when validation error increases",
      difficulty: "intermediate" as const,
      estimatedMinutes: 60,
      order: 6,
      isPublished: true,
    },
  ];

  // Deep Learning - New Modules
  const deepLearningId = pathMap.get("deep-learning-neural-networks")!;
  const deepLearningModules = [
    {
      pathId: deepLearningId,
      title: "Introduction to Neural Networks",
      slug: "intro-neural-networks",
      description: "Understand the basics of neural networks and how they learn.",
      content: "# Introduction to Neural Networks\n\n## What are Neural Networks?\nComputational models inspired by the human brain, consisting of interconnected nodes (neurons).\n\n## Key Components\n1. **Input Layer**: Receives data\n2. **Hidden Layers**: Process information\n3. **Output Layer**: Produces predictions\n4. **Weights**: Connection strengths\n5. **Activation Functions**: Introduce non-linearity\n\n## How They Learn\n- Forward propagation: Data flows through network\n- Backpropagation: Errors flow backward to update weights\n- Gradient descent: Optimization algorithm",
      difficulty: "advanced" as const,
      estimatedMinutes: 70,
      order: 1,
      isPublished: true,
    },
    {
      pathId: deepLearningId,
      title: "Convolutional Neural Networks (CNNs)",
      slug: "convolutional-neural-networks",
      description: "Learn about CNNs and their applications in computer vision.",
      content: "# Convolutional Neural Networks\n\n## What are CNNs?\nSpecialized neural networks for processing grid-like data (images, videos).\n\n## Key Layers\n1. **Convolutional Layer**: Detects features using filters\n2. **Pooling Layer**: Reduces spatial dimensions\n3. **Fully Connected Layer**: Classification\n\n## Applications\n- Image classification\n- Object detection\n- Facial recognition\n- Medical image analysis\n\n## Popular Architectures\n- LeNet, AlexNet, VGG\n- ResNet, Inception\n- EfficientNet",
      difficulty: "advanced" as const,
      estimatedMinutes: 80,
      order: 2,
      isPublished: true,
    },
    {
      pathId: deepLearningId,
      title: "Recurrent Neural Networks (RNNs)",
      slug: "recurrent-neural-networks",
      description: "Explore RNNs for sequential data and time series analysis.",
      content: "# Recurrent Neural Networks\n\n## What are RNNs?\nNeural networks designed for sequential data with temporal dependencies.\n\n## Architecture\n- Hidden state maintains memory\n- Processes sequences one element at a time\n- Output depends on current input and previous states\n\n## Variants\n1. **LSTM**: Long Short-Term Memory - handles long sequences\n2. **GRU**: Gated Recurrent Unit - simplified LSTM\n\n## Applications\n- Language modeling\n- Machine translation\n- Speech recognition\n- Time series forecasting",
      difficulty: "advanced" as const,
      estimatedMinutes: 75,
      order: 3,
      isPublished: true,
    },
  ];

  // Insert all new modules
  const allNewModules = [
    ...aiFundamentalsNewModules,
    ...mlEssentialsNewModules,
    ...deepLearningModules,
  ];

  for (const module of allNewModules) {
    const [inserted] = await db.insert(modules).values(module);
    console.log(`✓ Seeded module: ${module.title}`);
    
    // Create a quiz for this module
    const moduleId = Number(inserted.insertId);
    
    const [quizInserted] = await db.insert(quizzes).values({
      moduleId,
      title: `${module.title} Quiz`,
      description: `Test your knowledge of ${module.title.toLowerCase()}`,
      passingScore: 70,
      timeLimit: 10,
    });
    
    const quizId = Number(quizInserted.insertId);
    console.log(`  ✓ Created quiz for module`);
    
    // Add sample questions (3-5 per quiz)
    const sampleQuestions = generateQuizQuestions(module.title, quizId);
    for (const question of sampleQuestions) {
      await db.insert(quizQuestions).values(question);
    }
    console.log(`  ✓ Added ${sampleQuestions.length} quiz questions`);
  }

  console.log("\n✅ Additional modules and quizzes seeded successfully!");
}

function generateQuizQuestions(moduleTitle: string, quizId: number) {
  // Generate contextual quiz questions based on module title
  const questionSets: Record<string, any[]> = {
    "AI Applications in Daily Life": [
      {
        quizId,
        question: "Which AI technology powers virtual assistants like Siri and Alexa?",
        questionType: "multiple_choice" as const,
        options: JSON.stringify(["Natural Language Processing", "Computer Vision", "Robotics", "Expert Systems"]),
        correctAnswer: 0,
        explanation: "Natural Language Processing (NLP) enables virtual assistants to understand and respond to human speech.",
        order: 1,
      },
      {
        quizId,
        question: "Recommendation systems use AI to suggest content on platforms like Netflix and Spotify.",
        questionType: "true_false" as const,
        options: JSON.stringify(["True", "False"]),
        correctAnswer: 0,
        explanation: "True. Recommendation systems analyze user behavior and preferences to suggest relevant content.",
        order: 2,
      },
      {
        quizId,
        question: "Which of the following is NOT a common application of AI in daily life?",
        questionType: "multiple_choice" as const,
        options: JSON.stringify(["Smart thermostats", "Facial recognition", "Manual typewriters", "Spam filters"]),
        correctAnswer: 2,
        explanation: "Manual typewriters are mechanical devices that don't use AI technology.",
        order: 3,
      },
    ],
    "Ethics and Bias in AI": [
      {
        quizId,
        question: "What is the primary source of bias in AI systems?",
        questionType: "multiple_choice" as const,
        options: JSON.stringify(["Training data", "Hardware limitations", "Internet speed", "Programming language choice"]),
        correctAnswer: 0,
        explanation: "Biased or unrepresentative training data is the primary source of bias in AI systems.",
        order: 1,
      },
      {
        quizId,
        question: "AI systems can perpetuate and amplify human biases if not carefully designed.",
        questionType: "true_false" as const,
        options: JSON.stringify(["True", "False"]),
        correctAnswer: 0,
        explanation: "True. AI systems learn from data created by humans, which may contain biases.",
        order: 2,
      },
      {
        quizId,
        question: "Which ethical principle emphasizes making AI decisions understandable?",
        questionType: "multiple_choice" as const,
        options: JSON.stringify(["Transparency and explainability", "Speed optimization", "Cost reduction", "Market dominance"]),
        correctAnswer: 0,
        explanation: "Transparency and explainability ensure AI decisions can be understood and audited.",
        order: 3,
      },
    ],
    "Feature Engineering": [
      {
        quizId,
        question: "What is feature engineering?",
        questionType: "multiple_choice" as const,
        options: JSON.stringify(["Creating and transforming features to improve model performance", "Building hardware for AI", "Designing user interfaces", "Writing documentation"]),
        correctAnswer: 0,
        explanation: "Feature engineering involves creating new features or transforming existing ones to help models learn better.",
        order: 1,
      },
      {
        quizId,
        question: "One-hot encoding is used to convert categorical variables into numerical format.",
        questionType: "true_false" as const,
        options: JSON.stringify(["True", "False"]),
        correctAnswer: 0,
        explanation: "True. One-hot encoding creates binary columns for each category value.",
        order: 2,
      },
    ],
    "Model Evaluation Metrics": [
      {
        quizId,
        question: "Which metric represents the harmonic mean of precision and recall?",
        questionType: "multiple_choice" as const,
        options: JSON.stringify(["F1 Score", "Accuracy", "MSE", "R² Score"]),
        correctAnswer: 0,
        explanation: "F1 Score balances precision and recall, useful when class distribution is imbalanced.",
        order: 1,
      },
      {
        quizId,
        question: "RMSE (Root Mean Squared Error) is used for classification tasks.",
        questionType: "true_false" as const,
        options: JSON.stringify(["True", "False"]),
        correctAnswer: 1,
        explanation: "False. RMSE is a regression metric, not used for classification.",
        order: 2,
      },
    ],
    "Overfitting and Regularization": [
      {
        quizId,
        question: "What is a sign of overfitting?",
        questionType: "multiple_choice" as const,
        options: JSON.stringify(["High training accuracy but low test accuracy", "Low training and test accuracy", "High training and test accuracy", "Fast training time"]),
        correctAnswer: 0,
        explanation: "Overfitting occurs when a model performs well on training data but poorly on new data.",
        order: 1,
      },
      {
        quizId,
        question: "Dropout is a regularization technique that randomly drops neurons during training.",
        questionType: "true_false" as const,
        options: JSON.stringify(["True", "False"]),
        correctAnswer: 0,
        explanation: "True. Dropout prevents overfitting by randomly deactivating neurons during training.",
        order: 2,
      },
    ],
  };

  // Return questions for this module or default questions
  return questionSets[moduleTitle] || [
    {
      quizId,
      question: `What is the main focus of ${moduleTitle}?`,
      questionType: "multiple_choice" as const,
      options: JSON.stringify(["Understanding key concepts", "Memorizing formulas", "Speed reading", "None of the above"]),
      correctAnswer: 0,
      explanation: "This module focuses on understanding fundamental concepts.",
      order: 1,
    },
  ];
}

seedMoreModules().catch(console.error);
