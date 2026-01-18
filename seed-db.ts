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

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🌱 Starting database seeding...\n');

async function seedDatabase() {
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

    // ===== LEARNING PATHS =====
    console.log('📚 Seeding learning paths...');
    
    const learningPathsData = [
      {
        title: 'AI Fundamentals',
        slug: 'ai-fundamentals',
        description: 'Start your AI journey with the basics. Learn core concepts, terminology, and foundational principles of artificial intelligence.',
        difficulty: 'beginner',
        estimated_hours: 20,
        icon: 'Brain',
        color: 'blue',
        order: 1,
        is_published: true,
      },
      {
        title: 'Machine Learning',
        slug: 'machine-learning',
        description: 'Master supervised and unsupervised learning algorithms. Build predictive models and understand the mathematics behind ML.',
        difficulty: 'intermediate',
        estimated_hours: 40,
        icon: 'Cpu',
        color: 'green',
        order: 2,
        is_published: true,
      },
      {
        title: 'Deep Learning',
        slug: 'deep-learning',
        description: 'Dive into neural networks, CNNs, RNNs, and transformers. Learn to build and train deep learning models from scratch.',
        difficulty: 'advanced',
        estimated_hours: 60,
        icon: 'Network',
        color: 'purple',
        order: 3,
        is_published: true,
      },
      {
        title: 'Natural Language Processing',
        slug: 'natural-language-processing',
        description: 'Process and understand human language with AI. Learn text classification, sentiment analysis, and language generation.',
        difficulty: 'advanced',
        estimated_hours: 50,
        icon: 'MessageSquare',
        color: 'orange',
        order: 4,
        is_published: true,
      },
      {
        title: 'Computer Vision',
        slug: 'computer-vision',
        description: 'Teach machines to see and interpret visual data. Master image classification, object detection, and segmentation.',
        difficulty: 'advanced',
        estimated_hours: 55,
        icon: 'Eye',
        color: 'red',
        order: 5,
        is_published: true,
      },
    ];

    for (const path of learningPathsData) {
      await pool.query(`
        INSERT INTO learning_paths (title, slug, description, difficulty, estimated_hours, icon, color, \`order\`, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          title = VALUES(title),
          description = VALUES(description),
          difficulty = VALUES(difficulty),
          estimated_hours = VALUES(estimated_hours),
          icon = VALUES(icon),
          color = VALUES(color),
          \`order\` = VALUES(\`order\`),
          is_published = VALUES(is_published),
          updated_at = NOW()
      `, [path.title, path.slug, path.description, path.difficulty, path.estimated_hours, path.icon, path.color, path.order, path.is_published]);
    }

    console.log(`✅ Seeded ${learningPathsData.length} learning paths\n`);

    // ===== RESOURCES =====
    console.log('📖 Seeding resources...');
    
    // Note: resources table has these columns:
    // id, title, description, url, resource_type (enum), difficulty (enum), tags, is_premium, is_published, created_at, updated_at
    const resourcesData = [
      {
        title: 'Introduction to Artificial Intelligence',
        resource_type: 'article',
        url: 'https://example.com/intro-to-ai',
        description: 'A comprehensive introduction to AI concepts and applications',
        difficulty: 'beginner',
        tags: 'AI,basics,introduction',
        is_premium: false,
        is_published: true,
      },
      {
        title: 'Python for Machine Learning',
        resource_type: 'course',
        url: 'https://example.com/python-ml',
        description: 'Learn Python programming essentials for machine learning',
        difficulty: 'beginner',
        tags: 'Python,programming,ML',
        is_premium: false,
        is_published: true,
      },
      {
        title: 'Neural Networks Explained',
        resource_type: 'video',
        url: 'https://example.com/neural-networks',
        description: 'Visual explanation of how neural networks work',
        difficulty: 'intermediate',
        tags: 'neural networks,deep learning,video',
        is_premium: false,
        is_published: true,
      },
      {
        title: 'TensorFlow Documentation',
        resource_type: 'documentation',
        url: 'https://www.tensorflow.org/learn',
        description: 'Official TensorFlow learning resources and guides',
        difficulty: 'intermediate',
        tags: 'TensorFlow,documentation,tools',
        is_premium: false,
        is_published: true,
      },
      {
        title: 'PyTorch Tutorials',
        resource_type: 'course',
        url: 'https://pytorch.org/tutorials/',
        description: 'Official PyTorch tutorials for deep learning',
        difficulty: 'intermediate',
        tags: 'PyTorch,tutorials,deep learning',
        is_premium: false,
        is_published: true,
      },
      {
        title: 'Transformers and Attention Mechanisms',
        resource_type: 'article',
        url: 'https://example.com/transformers',
        description: 'Deep dive into transformer architecture and self-attention',
        difficulty: 'advanced',
        tags: 'transformers,NLP,attention',
        is_premium: false,
        is_published: true,
      },
      {
        title: 'Computer Vision with OpenCV',
        resource_type: 'course',
        url: 'https://example.com/opencv',
        description: 'Practical computer vision techniques using OpenCV',
        difficulty: 'intermediate',
        tags: 'OpenCV,computer vision,practical',
        is_premium: false,
        is_published: true,
      },
      {
        title: 'AI Ethics and Responsible AI',
        resource_type: 'article',
        url: 'https://example.com/ai-ethics',
        description: 'Understanding ethical considerations in AI development',
        difficulty: 'beginner',
        tags: 'ethics,responsible AI,guidelines',
        is_premium: false,
        is_published: true,
      },
    ];

    for (const resource of resourcesData) {
      await pool.query(`
        INSERT INTO resources (title, description, url, resource_type, difficulty, tags, is_premium, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          description = VALUES(description),
          url = VALUES(url),
          resource_type = VALUES(resource_type),
          difficulty = VALUES(difficulty),
          tags = VALUES(tags),
          is_premium = VALUES(is_premium),
          is_published = VALUES(is_published),
          updated_at = NOW()
      `, [resource.title, resource.description, resource.url, resource.resource_type, resource.difficulty, resource.tags, resource.is_premium, resource.is_published]);
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
}

seedDatabase();
