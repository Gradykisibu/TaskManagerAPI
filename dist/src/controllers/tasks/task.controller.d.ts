import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/userValidations/validateUser";
/**
 * Handles the HTTP request to retrieve all tasks.
 * @async
 * @param _req - Express Request object (unused)
 * @param res - Express Response object
 */
export declare function getTasksHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Handles the HTTP request to retrieve a single task by its ID.
 * @async
 * @param req - Express Request object containing the task ID in route parameters
 * @param res - Express Response object
 */
export declare function getTaskByIdHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Handles the HTTP request to create a new task.
 * @async
 * @param req - Express Request object containing the task title in the body
 * @param res - Express Response object
 */
export declare function createTaskHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Handles the HTTP request to update an existing task.
 * @async
 * @param req - Express Request object containing the task ID and update fields
 * @param res - Express Response object
 */
export declare function updateTaskHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Handles the HTTP request to delete a task by its ID.
 * @async
 * @param req - Express Request object containing the task ID in route parameters
 * @param res - Express Response object
 */
export declare function deleteTaskHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=task.controller.d.ts.map