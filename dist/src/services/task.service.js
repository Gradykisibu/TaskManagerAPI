"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = getAllTasks;
exports.getTask = getTask;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
const prisma_js_1 = __importDefault(require("../utils/prisma.js"));
// =========================
// Read Operations (Queries)
// =========================
/**
 * Retrieves all tasks from the database.
 * @returns A promise that resolves to an array of all task records.
 */
async function getAllTasks(userId, page, limit, completed, sortBy, order, search) {
    const skip = (page - 1) * limit;
    const where = {
        userId,
        ...(completed !== undefined && { completed }),
        ...(search && { title: { contains: search, mode: "insensitive" } })
    };
    const [tasks, totalTasks] = await Promise.all([
        prisma_js_1.default.task.findMany({
            where: where,
            orderBy: [{ [sortBy]: order }, { id: "asc" }],
            skip,
            take: limit,
        }),
        prisma_js_1.default.task.count({ where })
    ]);
    return { tasks, totalTasks };
}
/**
 * Retrieves a single task by its unique ID.
 * @async
 * @param id - The unique identifier of the task.
 * @returns The task object if found, or an error message object if it doesn't exist.
 */
async function getTask(id, userId) {
    return await prisma_js_1.default.task.findFirst({
        where: { id, userId }
    });
}
// =========================
// Create Operations (Mutations)
// =========================
/**
 * Creates a new task in the database.
 * @async
 * @param title - The title/description of the new task.
 * @returns A promise that resolves to the newly created task.
 */
async function createTask(title, userId) {
    return await prisma_js_1.default.task.create({
        data: {
            title,
            userId
        },
    });
}
// =========================
// Update Operations (Mutations)
// =========================
/**
 * Updates an existing task by its ID with partial or full updates.
 * @async
 * @param id - The unique identifier of the task to update.
 * @param updates - An object containing the fields to update (title and/or completed status).
 * @returns A promise that resolves to the updated task record.
 * @throws Will throw an error if the task is not found or the update fails.
 */
async function updateTask(id, userId, updates) {
    return await prisma_js_1.default.task.update({
        where: { id, userId },
        data: updates
    });
}
;
// =========================
// Delete Operations (Mutations)
// =========================
/**
 * Deletes a task from the database by its ID.
 * @async
 * @param id - The unique identifier of the task to delete.
 * @returns A promise that resolves to the deleted task record.
 */
async function deleteTask(taskId, userId) {
    return await prisma_js_1.default.task.delete({
        where: { id: taskId, userId }
    });
}
/*
CREATE — prisma.task.create()
READ all — prisma.task.findMany()
READ one — prisma.task.findUnique()
UPDATE — prisma.task.update()
DELETE — prisma.task.delete()
*/ 
//# sourceMappingURL=task.service.js.map