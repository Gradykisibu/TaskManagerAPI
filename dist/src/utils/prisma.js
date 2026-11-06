"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_js_1 = require("../../generated/prisma/client.js");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL_DEV;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
}
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new client_js_1.PrismaClient({ adapter });
exports.default = prisma;
//# sourceMappingURL=prisma.js.map