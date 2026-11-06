import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL_TEST ??
  process.env.DATABASE_URL_PROD;

if (!connectionString) {
  throw new Error("No database URL configured");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;