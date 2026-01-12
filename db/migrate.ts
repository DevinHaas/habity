import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigration() {
  console.log("Migration started ⌛");
  console.log("NODE_ENV:", process.env.NODE_ENV);

  // Not using the getDbUrl helper function because we aren't copying that into our runtime app prior to deployment in our Dockerfile. We'll live with the code duplication.
  const dbUrl = (
    process.env.NODE_ENV === "production"
      ? process.env.DATABASE_URL
      : process.env.DEV_DATABASE_URL
  ) as string;

  if (!dbUrl) {
    console.error("🚨 FATAL: No database URL found!");
    console.error("NODE_ENV:", process.env.NODE_ENV);
    console.error("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    console.error("DEV_DATABASE_URL:", process.env.DEV_DATABASE_URL ? "Set" : "Not set");
    throw new Error("No database url found");
  }

  console.log("Database URL found, connecting...");

  const client = postgres(dbUrl, {
    max: 1,
    // SSL must be `require`. `true` or `verify-full` do not work since Railway uses self-signed certificates.
    ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
  });

  const db = drizzle(client);
  try {
    console.log("Running migrations from ./db/migrations...");
    await migrate(db, { migrationsFolder: "./db/migrations" });
    console.log("Migration completed ✅");
  } catch (error) {
    console.error("Migration failed 🚨:", error);
    throw error; // Re-throw to prevent the app from starting
  } finally {
    await client.end();
  }
}

runMigration().catch((error) =>
  console.error("Error in migration process 🚨:", error),
);
