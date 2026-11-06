
import { afterEach, afterAll } from "vitest";
import prisma from "../src/utils/prisma.js";

afterEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.refreshToken.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
