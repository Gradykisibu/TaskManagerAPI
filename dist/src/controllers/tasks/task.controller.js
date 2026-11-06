"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksHandler = getTasksHandler;
exports.getTaskByIdHandler = getTaskByIdHandler;
exports.createTaskHandler = createTaskHandler;
exports.updateTaskHandler = updateTaskHandler;
exports.deleteTaskHandler = deleteTaskHandler;
const task_service_js_1 = require("../../services/task.service.js");
const client_js_1 = require("../../../generated/prisma/client.js");
/**
 * Handles the HTTP request to retrieve all tasks.
 * @async
 * @param _req - Express Request object (unused)
 * @param res - Express Response object
 */
async function getTasksHandler(req, res, next) {
    try {
        const userId = req.id;
        if (userId === undefined) {
            res.status(401).json({
                success: false,
                message: "Authentication userId is required",
            });
            return;
        }
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const completedQuery = req.query.completed;
        const sortByQuery = req.query.sortBy ?? "createdAt";
        const orderQuery = req.query.order ?? "desc";
        const searchQuery = req.query.search;
        let completed;
        if (!Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100) {
            res.status(400).json({
                success: false,
                message: "Invalid pagination parameters"
            });
            return;
        }
        if (completedQuery !== undefined) {
            if (completedQuery === "true") {
                completed = true;
            }
            else if (completedQuery === "false") {
                completed = false;
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "completed must be true or false"
                });
                return;
            }
        }
        if (sortByQuery !== "createdAt" &&
            sortByQuery !== "title") {
            res.status(400).json({
                success: false,
                message: "sortBy must be createdAt or title"
            });
            return;
        }
        if (orderQuery !== "asc" && orderQuery !== "desc") {
            res.status(400).json({
                success: false,
                message: "order must be asc or desc"
            });
            return;
        }
        if (searchQuery !== undefined &&
            (typeof searchQuery !== "string" || searchQuery.trim().length === 0)) {
            res.status(400).json({
                success: false,
                message: "search must be a non-empty string"
            });
            return;
        }
        const search = searchQuery?.trim();
        const sortBy = sortByQuery;
        const order = orderQuery;
        const results = await (0, task_service_js_1.getAllTasks)(userId, page, limit, completed, sortBy, order, search);
        const totalPages = Math.ceil(results.totalTasks / limit);
        res.status(200).json({
            success: true,
            data: results.tasks,
            pagination: {
                totalTasks: results.totalTasks,
                currentPage: page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Handles the HTTP request to retrieve a single task by its ID.
 * @async
 * @param req - Express Request object containing the task ID in route parameters
 * @param res - Express Response object
 */
async function getTaskByIdHandler(req, res, next) {
    try {
        const taskId = Number(req.params.id);
        if (!Number.isInteger(taskId) || taskId <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid task ID"
            });
            return;
        }
        const userId = req.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized to fetch task"
            });
            return;
        }
        const task = await (0, task_service_js_1.getTask)(taskId, userId);
        if (task === null) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: task
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Handles the HTTP request to create a new task.
 * @async
 * @param req - Express Request object containing the task title in the body
 * @param res - Express Response object
 */
async function createTaskHandler(req, res, next) {
    try {
        // Get the ID attached by your authenticateToken middleware
        const userId = req.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const newTask = await (0, task_service_js_1.createTask)(req.body.title, userId);
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: newTask
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Handles the HTTP request to update an existing task.
 * @async
 * @param req - Express Request object containing the task ID and update fields
 * @param res - Express Response object
 */
async function updateTaskHandler(req, res, next) {
    try {
        const id = Number(req.params.id);
        const userId = req.id;
        const { title, completed } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized to update task"
            });
            return;
        }
        const updatedTask = await (0, task_service_js_1.updateTask)(id, userId, { title, completed });
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask
        });
    }
    catch (error) {
        if (error instanceof client_js_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025") {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        next(error);
    }
}
/**
 * Handles the HTTP request to delete a task by its ID.
 * @async
 * @param req - Express Request object containing the task ID in route parameters
 * @param res - Express Response object
 */
async function deleteTaskHandler(req, res, next) {
    try {
        const taskId = Number(req.params.id);
        const userId = req.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated to delete task"
            });
            return;
        }
        const deletedTask = await (0, task_service_js_1.deleteTask)(taskId, userId);
        // Note: Standard successful deletion typically returns 200 OK or 204 No Content, 
        // but 200 with JSON payload works great here too.
        res.status(200).json({
            success: true,
            message: "Task has been deleted",
            data: deletedTask
        });
    }
    catch (error) {
        if (error instanceof client_js_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025") {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }
        next(error);
    }
}
//# sourceMappingURL=task.controller.js.map