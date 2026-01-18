#!/usr/bin/env node

/**
 * Database Migration Script for AI Learning Curve
 * 
 * This script runs all SQL migrations from the drizzle/migrations directory
 * to create the database tables. Run this before seeding the database.
 * 
 * Usage:
 *   pnpm tsx migrate.ts
 * 
 * Or in Docker container:
 *   docker exec -it ai-learning-curve pnpm tsx migrate.ts
 */

import mysql from 'mysql2/promise';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔄 Starting database migration...\n');

async function runMigrations() {
  try {
    // Parse DATABASE_URL manually (format: mysql://user:pass@host:port/database)
    const match = DATABASE_URL.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    
    if (!match) {
      throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:pass@host:port/database');
    }
    
    const [, user, password, host, port, database] = match;
    
    // Create database connection
    const pool = mysql.createPool({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true, // Allow multiple SQL statements
    });

    console.log(`📡 Connected to database: ${database}@${host}:${port}\n`);

    // Get all SQL migration files
    const migrationsDir = join(process.cwd(), 'drizzle');
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort(); // Sort to run migrations in order

    console.log(`📂 Found ${files.length} migration files\n`);

    // Run each migration
    for (const file of files) {
      console.log(`⚙️  Running migration: ${file}`);
      let sql = readFileSync(join(migrationsDir, file), 'utf-8');
      
      // Remove drizzle-kit specific comments that MariaDB doesn't understand
      sql = sql.replace(/--> statement-breakpoint/g, '');
      
      // Split by semicolon and filter out empty statements and comments
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (err: any) {
          // Ignore "table already exists" and "duplicate key" errors
          if (err.code !== 'ER_TABLE_EXISTS_ERROR' && err.code !== 'ER_DUP_KEYNAME') {
            throw err;
          }
        }
      }
      
      console.log(`   ✅ Completed: ${file}`);
    }

    // Verify tables were created
    const [tables] = await pool.query('SHOW TABLES');
    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Total tables in database: ${(tables as any[]).length}\n`);

    await pool.end();
    
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();
