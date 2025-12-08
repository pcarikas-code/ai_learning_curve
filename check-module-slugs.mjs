import { drizzle } from "drizzle-orm/mysql2";
import { modules } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function checkSlugs() {
  const allModules = await db.select({ id: modules.id, slug: modules.slug, title: modules.title }).from(modules);
  console.log("Module slugs:");
  allModules.forEach(m => {
    console.log(`  ${m.slug} - ${m.title}`);
  });
  process.exit(0);
}

checkSlugs();
