// import { UpdateTaskInput, CreateTaskInput } from "../validators/tasks/task.validator"
import prisma from "../utils/prisma.js"

// =========================
// Read Operations (Queries)
// =========================

/**
 * Retrieves all tasks from the database.
 * @returns A promise that resolves to an array of all task records.
 */
export async function getAllTasks(userId: number, page:number, limit:number, completed: boolean, sortBy:string, order: string, search:string) {
    const skip = (page - 1) * limit

    const where = {
        userId,
        ...(completed !== undefined && { completed }),
        ...(search && { title: { contains: search, mode: "insensitive" as const}})
    }

    const [tasks, totalTasks] = await Promise.all([

        prisma.task.findMany({
           where: where,
           orderBy: [{ [sortBy]: order },{id:"asc"}],
           skip,
           take: limit,
       }),

       prisma.task.count({ where })

    ])
    return {tasks, totalTasks};
}
    
/**
 * Retrieves a single task by its unique ID.
 * @async
 * @param id - The unique identifier of the task.
 * @returns The task object if found, or an error message object if it doesn't exist.
 */
export async function getTask(id: number, userId:number) {
    return await prisma.task.findFirst({
        where: { id, userId }
    })
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
export async function createTask(title: string, userId: number): Promise<{
    title: string;
    completed: boolean;
    createdAt: Date;
    id: number;
    userId: number | null;
}> {
    return await prisma.task.create({
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
export async function updateTask(id: number, userId: number, updates: { title?: string, completed?: boolean }) {
    return await prisma.task.update({
        where: { id, userId},
        data: updates
    })
};

// =========================
// Delete Operations (Mutations)
// =========================

/**
 * Deletes a task from the database by its ID.
 * @async
 * @param id - The unique identifier of the task to delete.
 * @returns A promise that resolves to the deleted task record.
 */
export async function deleteTask(taskId: number, userId: number) {
    return await prisma.task.delete({
        where: { id: taskId , userId }
    })
}

/*
CREATE — prisma.task.create()
READ all — prisma.task.findMany()
READ one — prisma.task.findUnique()
UPDATE — prisma.task.update()
DELETE — prisma.task.delete()
*/