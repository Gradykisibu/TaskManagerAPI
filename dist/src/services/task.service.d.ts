/**
 * Retrieves all tasks from the database.
 * @returns A promise that resolves to an array of all task records.
 */
export declare function getAllTasks(userId: number, page: number, limit: number, completed: boolean, sortBy: string, order: string, search: string): Promise<{
    tasks: {
        id: number;
        title: string;
        completed: boolean;
        createdAt: Date;
        userId: number | null;
    }[];
    totalTasks: number;
}>;
/**
 * Retrieves a single task by its unique ID.
 * @async
 * @param id - The unique identifier of the task.
 * @returns The task object if found, or an error message object if it doesn't exist.
 */
export declare function getTask(id: number, userId: number): Promise<{
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
    userId: number | null;
} | null>;
/**
 * Creates a new task in the database.
 * @async
 * @param title - The title/description of the new task.
 * @returns A promise that resolves to the newly created task.
 */
export declare function createTask(title: string, userId: number): Promise<{
    title: string;
    completed: boolean;
    createdAt: Date;
    id: number;
    userId: number | null;
}>;
/**
 * Updates an existing task by its ID with partial or full updates.
 * @async
 * @param id - The unique identifier of the task to update.
 * @param updates - An object containing the fields to update (title and/or completed status).
 * @returns A promise that resolves to the updated task record.
 * @throws Will throw an error if the task is not found or the update fails.
 */
export declare function updateTask(id: number, userId: number, updates: {
    title?: string;
    completed?: boolean;
}): Promise<{
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
    userId: number | null;
}>;
/**
 * Deletes a task from the database by its ID.
 * @async
 * @param id - The unique identifier of the task to delete.
 * @returns A promise that resolves to the deleted task record.
 */
export declare function deleteTask(taskId: number, userId: number): Promise<{
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
    userId: number | null;
}>;
//# sourceMappingURL=task.service.d.ts.map