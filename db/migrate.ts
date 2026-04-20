import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigration() {
  // Not using the getDbUrl helper function because we aren't copying that into our runtime app prior to deployment in our Dockerfile. We'll live with the code duplication.
  const dbUrl = (
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL
      : process.env.DEV_DATABASE_URL
  ) as string;

  if (!dbUrl) {
    throw new Error("No database url found");
  }

  const client = postgres(dbUrl);
  const db = drizzle(client);
  try {
    await migrate(db, { migrationsFolder: "./db/migrations" });
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
}

runMigration().catch((error) => { throw error; });
