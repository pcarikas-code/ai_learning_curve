#!/usr/bin/env node

/**
 * Database Seeding Script for AI Learning Curve
 * 
 * This script populates the database with initial learning paths and resources.
 * Run this after deploying to production to add content to the platform.
 * 
 * Usage:
 *   pnpm tsx seed-db.ts
 * 
 * Or in Docker container:
 *   docker exec -it ai-learning-curve pnpm tsx seed-db.ts
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🌱 Starting database seeding...\n');

try {
  // Parse DATABASE_URL manually (format: mysql://user:pass@host:port/database)
  const match = DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  
  if (!match) {
    throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:pass@host:port/database');
  }
  
  const [, user, password, host, port, database] = match;
  
  // Create database connection with parsed config
  const pool = mysql.createPool({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  const db = drizzle(pool);

  // ===== LEARNING PATHS =====
  console.log('📚 Seeding learning paths...');
  
  const learningPathsData = [
    {
      title: 'AI Fundamentals',
      slug: 'ai-fundamentals',
      description: 'Start your AI journey with the basics. Learn core concepts, terminology, and foundational principles of artificial intelligence.',
      difficulty: 'beginner',
      estimatedHours: 20,
      icon: 'Brain',
      color: 'blue',
      order: 1,
      isPublished: true,
    },
    {
      title: 'Machine Learning',
      slug: 'machine-learning',
      description: 'Master supervised and unsupervised learning algorithms. Build predictive models and understand the mathematics behind ML.',
      difficulty: 'intermediate',
      estimatedHours: 40,
      icon: 'Cpu',
      color: 'green',
      order: 2,
      isPublished: true,
    },
    {
      title: 'Deep Learning',
      slug: 'deep-learning',
      description: 'Dive into neural networks, CNNs, RNNs, and transformers. Learn to build and train deep learning models from scratch.',
      difficulty: 'advanced',
      estimatedHours: 60,
      icon: 'Network',
      color: 'purple',
      order: 3,
      isPublished: true,
    },
    {
      title: 'Natural Language Processing',
      slug: 'natural-language-processing',
      description: 'Process and understand human language with AI. Learn text classification, sentiment analysis, and language generation.',
      difficulty: 'advanced',
      estimatedHours: 50,
      icon: 'MessageSquare',
      color: 'orange',
      order: 4,
      isPublished: true,
    },
    {
      title: 'Computer Vision',
      slug: 'computer-vision',
      description: 'Teach machines to see and interpret visual data. Master image classification, object detection, and segmentation.',
      difficulty: 'advanced',
      estimatedHours: 55,
      icon: 'Eye',
      color: 'red',
      order: 5,
      isPublished: true,
    },
  ];

  for (const path of learningPathsData) {
    await db.insert(schema.learningPaths).values(path).onDuplicateKeyUpdate({
      set: { updatedAt: new Date() }
    });
  }

  console.log(`✅ Seeded ${learningPathsData.length} learning paths\n`);

  // ===== RESOURCES =====
  console.log('📖 Seeding resources...');
  
  const resourcesData = [
    {
      title: 'Introduction to Artificial Intelligence',
      type: 'article',
      url: 'https://example.com/intro-to-ai',
      description: 'A comprehensive introduction to AI concepts and applications',
      category: 'AI Basics',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      isPublished: true,
    },
    {
      title: 'Python for Machine Learning',
      type: 'tutorial',
      url: 'https://example.com/python-ml',
      description: 'Learn Python programming essentials for machine learning',
      category: 'Programming',
      difficulty: 'beginner',
      estimatedMinutes: 45,
      isPublished: true,
    },
    {
      title: 'Neural Networks Explained',
      type: 'video',
      url: 'https://example.com/neural-networks',
      description: 'Visual explanation of how neural networks work',
      category: 'Deep Learning',
      difficulty: 'intermediate',
      estimatedMinutes: 30,
      isPublished: true,
    },
    {
      title: 'TensorFlow Documentation',
      type: 'documentation',
      url: 'https://www.tensorflow.org/learn',
      description: 'Official TensorFlow learning resources and guides',
      category: 'Tools',
      difficulty: 'intermediate',
      estimatedMinutes: null,
      isPublished: true,
    },
    {
      title: 'PyTorch Tutorials',
      type: 'tutorial',
      url: 'https://pytorch.org/tutorials/',
      description: 'Official PyTorch tutorials for deep learning',
      category: 'Tools',
      difficulty: 'intermediate',
      estimatedMinutes: null,
      isPublished: true,
    },
    {
      title: 'Transformers and Attention Mechanisms',
      type: 'article',
      url: 'https://example.com/transformers',
      description: 'Deep dive into transformer architecture and self-attention',
      category: 'NLP',
      difficulty: 'advanced',
      estimatedMinutes: 60,
      isPublished: true,
    },
    {
      title: 'Computer Vision with OpenCV',
      type: 'tutorial',
      url: 'https://example.com/opencv',
      description: 'Practical computer vision techniques using OpenCV',
      category: 'Computer Vision',
      difficulty: 'intermediate',
      estimatedMinutes: 90,
      isPublished: true,
    },
    {
      title: 'AI Ethics and Responsible AI',
      type: 'article',
      url: 'https://example.com/ai-ethics',
      description: 'Understanding ethical considerations in AI development',
      category: 'Ethics',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      isPublished: true,
    },
  ];

  for (const resource of resourcesData) {
    await db.insert(schema.resources).values(resource).onDuplicateKeyUpdate({
      set: { updatedAt: new Date() }
    });
  }

  console.log(`✅ Seeded ${resourcesData.length} resources\n`);

  // Close connection
  await pool.end();

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('You can now visit your application to see the learning paths and resources.');
  
} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
}
