import { db } from "./index";
import { users } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  await db.insert(users).values([
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
  ]);

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed();
