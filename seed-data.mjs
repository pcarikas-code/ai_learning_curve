import { drizzle } from "drizzle-orm/mysql2";
import { learningPaths, modules, quizzes, quizQuestions, resources } from "./drizzle/schema.js";
import "dotenv/config";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("Seeding database...");

  // Insert learning paths
  const pathsData = [
    {
      title: "AI Fundamentals",
      slug: "ai-fundamentals",
      description: "Start your AI journey with the basics. Learn what AI is, how it works, and its real-world applications.",
      difficulty: "beginner",
      estimatedHours: 20,
      icon: "Brain",
      color: "blue",
      order: 1,
      isPublished: true,
    },
    {
      title: "Machine Learning",
      slug: "machine-learning",
      description: "Dive into machine learning algorithms, supervised and unsupervised learning, and practical implementations.",
      difficulty: "intermediate",
      estimatedHours: 40,
      icon: "Cpu",
      color: "green",
      order: 2,
      isPublished: true,
    },
    {
      title: "Deep Learning",
      slug: "deep-learning",
      description: "Master neural networks, CNNs, RNNs, and advanced deep learning architectures.",
      difficulty: "advanced",
      estimatedHours: 60,
      icon: "Network",
      color: "purple",
      order: 3,
      isPublished: true,
    },
    {
      title: "Natural Language Processing",
      slug: "nlp",
      description: "Learn how AI understands and generates human language, from tokenization to transformers.",
      difficulty: "intermediate",
      estimatedHours: 35,
      icon: "MessageSquare",
      color: "orange",
      order: 4,
      isPublished: true,
    },
    {
      title: "Computer Vision",
      slug: "computer-vision",
      description: "Explore how AI sees and interprets images and videos, from basic image processing to object detection.",
      difficulty: "advanced",
      estimatedHours: 45,
      icon: "Eye",
      color: "red",
      order: 5,
      isPublished: true,
    },
  ];

  await db.insert(learningPaths).values(pathsData);
  console.log("Learning paths seeded");

  // Insert modules for AI Fundamentals
  const aiFundamentalsModules = [
    {
      pathId: 1,
      title: "What is Artificial Intelligence?",
      slug: "what-is-ai",
      description: "An introduction to AI, its history, and core concepts.",
      content: `# What is Artificial Intelligence?

Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.

## Brief History of AI

The field of AI research was founded at a workshop at Dartmouth College in 1956. Since then, AI has experienced several waves of optimism, followed by disappointment and loss of funding (known as "AI winters"), followed by new approaches, success, and renewed funding.

## Core Concepts

### 1. Machine Learning
The ability of machines to learn from data without being explicitly programmed.

### 2. Neural Networks
Computing systems inspired by biological neural networks that constitute animal brains.

### 3. Deep Learning
A subset of machine learning based on artificial neural networks with multiple layers.

### 4. Natural Language Processing
The ability of computers to understand, interpret, and generate human language.

## Real-World Applications

- **Healthcare**: Disease diagnosis, drug discovery, personalized treatment
- **Finance**: Fraud detection, algorithmic trading, risk assessment
- **Transportation**: Autonomous vehicles, traffic optimization
- **Entertainment**: Recommendation systems, content generation
- **Manufacturing**: Quality control, predictive maintenance

## The Future of AI

AI continues to evolve rapidly, with ongoing research in areas like:
- General AI (AGI)
- Explainable AI
- AI Ethics and Safety
- Quantum Machine Learning`,
      difficulty: "beginner",
      estimatedMinutes: 45,
      order: 1,
      isPublished: true,
    },
    {
      pathId: 1,
      title: "Types of AI Systems",
      slug: "types-of-ai",
      description: "Learn about narrow AI, general AI, and superintelligence.",
      content: `# Types of AI Systems

AI systems can be categorized in several ways based on their capabilities and functionalities.

## By Capability

### 1. Narrow AI (Weak AI)
AI systems designed to perform specific tasks. This is the only type of AI that currently exists.

**Examples:**
- Voice assistants (Siri, Alexa)
- Recommendation systems (Netflix, Spotify)
- Image recognition systems
- Chess-playing programs

### 2. General AI (Strong AI)
Hypothetical AI that can understand, learn, and apply knowledge across different domains, similar to human intelligence.

**Characteristics:**
- Ability to transfer learning between domains
- Common sense reasoning
- Abstract thinking
- Emotional intelligence

### 3. Superintelligence
Hypothetical AI that surpasses human intelligence in all aspects.

## By Functionality

### 1. Reactive Machines
The most basic type of AI that can only react to current situations.

**Example:** IBM's Deep Blue chess computer

### 2. Limited Memory
AI that can use past experiences to inform future decisions.

**Example:** Self-driving cars

### 3. Theory of Mind
AI that can understand emotions, beliefs, and thoughts (still in development).

### 4. Self-Aware AI
AI with consciousness and self-awareness (purely theoretical).

## Current State of AI

Today, all practical AI applications fall under Narrow AI. While significant progress has been made, we are still far from achieving General AI or Superintelligence.`,
      difficulty: "beginner",
      estimatedMinutes: 30,
      order: 2,
      isPublished: true,
    },
    {
      pathId: 1,
      title: "AI Ethics and Responsible AI",
      slug: "ai-ethics",
      description: "Understanding the ethical implications and responsible development of AI.",
      content: `# AI Ethics and Responsible AI

As AI becomes more prevalent in society, understanding its ethical implications is crucial for developers, users, and policymakers.

## Key Ethical Concerns

### 1. Bias and Fairness
AI systems can perpetuate or amplify existing biases present in training data.

**Examples:**
- Facial recognition systems with lower accuracy for certain demographics
- Hiring algorithms that discriminate based on gender or race
- Credit scoring systems that disadvantage certain groups

### 2. Privacy and Surveillance
AI enables unprecedented data collection and analysis capabilities.

**Concerns:**
- Mass surveillance systems
- Data breaches and misuse
- Lack of transparency in data usage

### 3. Accountability and Transparency
When AI makes decisions, who is responsible?

**Questions:**
- Who is liable when autonomous vehicles cause accidents?
- How can we explain AI decision-making processes?
- What rights do individuals have regarding AI decisions affecting them?

### 4. Job Displacement
AI automation may replace human workers in various industries.

**Considerations:**
- Need for retraining and education programs
- Universal basic income debates
- Changing nature of work

### 5. Autonomous Weapons
The development of AI-powered military systems raises serious concerns.

## Principles of Responsible AI

### 1. Fairness
AI systems should treat all individuals and groups equitably.

### 2. Transparency
AI systems should be explainable and their decision-making processes understandable.

### 3. Privacy
AI should respect individual privacy and data protection rights.

### 4. Safety and Security
AI systems should be robust, secure, and safe.

### 5. Accountability
Clear lines of responsibility should exist for AI systems and their outcomes.

## Best Practices

1. **Diverse Development Teams**: Include diverse perspectives in AI development
2. **Bias Testing**: Regularly test AI systems for bias across different demographics
3. **Human Oversight**: Maintain human control over critical AI decisions
4. **Transparency**: Document AI system capabilities and limitations
5. **Continuous Monitoring**: Regularly audit AI systems for unintended consequences`,
      difficulty: "beginner",
      estimatedMinutes: 40,
      order: 3,
      isPublished: true,
    },
  ];

  await db.insert(modules).values(aiFundamentalsModules);
  console.log("Modules seeded");

  // Insert a sample quiz
  const quizData = {
    moduleId: 1,
    title: "AI Fundamentals Quiz",
    description: "Test your understanding of basic AI concepts",
    passingScore: 70,
  };

  await db.insert(quizzes).values(quizData);
  console.log("Quiz seeded");

  // Insert quiz questions
  const questionsData = [
    {
      quizId: 1,
      question: "What does AI stand for?",
      questionType: "multiple_choice",
      options: JSON.stringify(["Artificial Intelligence", "Automated Information", "Advanced Integration", "Algorithmic Interpretation"]),
      correctAnswer: "Artificial Intelligence",
      explanation: "AI stands for Artificial Intelligence, which refers to the simulation of human intelligence in machines.",
      order: 1,
    },
    {
      quizId: 1,
      question: "Machine Learning is a subset of Artificial Intelligence.",
      questionType: "true_false",
      options: JSON.stringify(["True", "False"]),
      correctAnswer: "True",
      explanation: "Machine Learning is indeed a subset of AI that focuses on enabling machines to learn from data.",
      order: 2,
    },
    {
      quizId: 1,
      question: "Which of the following is an example of Narrow AI?",
      questionType: "multiple_choice",
      options: JSON.stringify(["A chess-playing program", "A human-like robot", "Superintelligent AI", "General AI"]),
      correctAnswer: "A chess-playing program",
      explanation: "A chess-playing program is an example of Narrow AI as it is designed for a specific task.",
      order: 3,
    },
  ];

  await db.insert(quizQuestions).values(questionsData);
  console.log("Quiz questions seeded");

  // Insert resources
  const resourcesData = [
    {
      title: "Introduction to AI - Stanford Course",
      description: "Comprehensive introduction to AI from Stanford University",
      url: "https://online.stanford.edu/courses/cs221-artificial-intelligence-principles-and-techniques",
      resourceType: "course",
      difficulty: "beginner",
      tags: JSON.stringify(["course", "stanford", "fundamentals"]),
      isPremium: false,
      isPublished: true,
    },
    {
      title: "AI For Everyone - Coursera",
      description: "Non-technical course about AI by Andrew Ng",
      url: "https://www.coursera.org/learn/ai-for-everyone",
      resourceType: "course",
      difficulty: "beginner",
      tags: JSON.stringify(["course", "coursera", "non-technical"]),
      isPremium: false,
      isPublished: true,
    },
    {
      title: "TensorFlow Documentation",
      description: "Official documentation for TensorFlow machine learning framework",
      url: "https://www.tensorflow.org/learn",
      resourceType: "documentation",
      difficulty: "intermediate",
      tags: JSON.stringify(["documentation", "tensorflow", "machine-learning"]),
      isPremium: false,
      isPublished: true,
    },
    {
      title: "PyTorch Tutorials",
      description: "Official tutorials for PyTorch deep learning framework",
      url: "https://pytorch.org/tutorials/",
      resourceType: "documentation",
      difficulty: "intermediate",
      tags: JSON.stringify(["documentation", "pytorch", "deep-learning"]),
      isPremium: false,
      isPublished: true,
    },
    {
      title: "Artificial Intelligence: A Modern Approach",
      description: "The leading textbook in Artificial Intelligence by Stuart Russell and Peter Norvig",
      url: "https://aima.cs.berkeley.edu/",
      resourceType: "book",
      difficulty: "advanced",
      tags: JSON.stringify(["book", "textbook", "comprehensive"]),
      isPremium: false,
      isPublished: true,
    },
  ];

  await db.insert(resources).values(resourcesData);
  console.log("Resources seeded");

  console.log("Database seeding completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
