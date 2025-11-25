// db/seed.ts
import 'dotenv/config'; // automatically load .env
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import Drizzle schema (Windows-safe)
const schemaPath = pathToFileURL(path.join(__dirname, "schema.ts")).href;
const { users } = await import(schemaPath);

// Ensure POSTGRES_URL is set
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("Error: POSTGRES_URL environment variable is not set.");
  process.exit(1);
}

// Create Postgres client
const client = new pg.Client({ connectionString });

try {
  await client.connect();
  console.log("Connected to Postgres successfully!");
} catch (err) {
  console.error("Failed to connect to Postgres:", err);
  process.exit(1);
}

// Initialize Drizzle ORM
const db = drizzle(client);

// Seed data
const seedData = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Smith", email: "jane@example.com" },
];

async function seed() {
  try {
    // Find emails already in the database
    const existingUsers = await db
      .select({ email: users.email })
      .from(users)
      .where(users.email.in(seedData.map(u => u.email)));

    const existingEmails = existingUsers.map(u => u.email);

    // Filter out users that already exist
    const newUsers = seedData.filter(u => !existingEmails.includes(u.email));

    if (newUsers.length > 0) {
      await db.insert(users).values(newUsers);
      console.log(`Inserted ${newUsers.length} new user(s).`);
    } else {
      console.log("No new users to insert. All users already exist.");
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Postgres connection closed.");
  }
}

// Run seed
await seed();
