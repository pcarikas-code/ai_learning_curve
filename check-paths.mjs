import { drizzle } from 'drizzle-orm/mysql2';
import { learningPaths } from './drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

async function checkPaths() {
  const paths = await db.select().from(learningPaths);
  console.log(JSON.stringify(paths.map(p => ({ id: p.id, title: p.title, slug: p.slug })), null, 2));
}

checkPaths();
