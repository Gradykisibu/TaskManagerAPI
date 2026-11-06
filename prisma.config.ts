
import "dotenv/config";
import { defineConfig } from "prisma/config";
import "dotenv/config";

const databaseUrl =
  process.env.DATABASE_URL_TEST ??
  process.env.DATABASE_URL_PROD;

if (!databaseUrl) {
  throw new Error("No database URL configured");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
