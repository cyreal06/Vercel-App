import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users } from "./schema";

const client = new pg.Client({
  connectionString: process.env.POSTGRES_URL!,
});

await client.connect();

const db = drizzle(client);

async function seed() {
  await db.insert(users).values([
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" }
  ]);
}

seed()
  .then(() => {
    console.log("Seed completed!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
