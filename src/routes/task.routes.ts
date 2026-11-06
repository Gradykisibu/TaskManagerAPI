
import { Router } from "express";

import {
    getTasksHandler,
    getTaskByIdHandler,
    createTaskHandler,
    updateTaskHandler,
    deleteTaskHandler,
} from "../controllers/tasks/task.controller.js";

// import { validateUser } from "../middleware/taskValidations/validateUser";
import { validateTaskUpdate } from "../middleware/taskValidations/validateTaskUpdate.js";
import { validateTaskId } from "../middleware/taskValidations/validateTaskId.js";
import { validateTask } from "../middleware/taskValidations/validateTask.js";

import { authenticateToken } from "../middleware/userValidations/validateUser.js";

// Create a router instance to register task-related routes.
const router = Router();

// ==================================================
// GET ROUTES
// ==================================================

// GET /api/v1/tasks
// Fetch all tasks.
// validateUser checks the request before the controller runs.
router.get("/", authenticateToken, getTasksHandler);

// GET /api/v1/tasks/:id
// Fetch a specific task using its ID.
router.get("/:id", authenticateToken, validateTaskId, getTaskByIdHandler);

// ==================================================
// POST ROUTES
// ==================================================

// POST /api/v1/tasks
// Create a new task after validating the submitted title.
router.post("/", authenticateToken, validateTask, createTaskHandler);

// ==================================================
// PATCH ROUTES
// ==================================================

// PATCH /api/v1/tasks/:id
// Update an existing task after validating the request
// and checking the submitted update data.
router.patch("/:id", authenticateToken, validateTaskId, validateTaskUpdate, updateTaskHandler);

// ==================================================
// DELETE ROUTES
// ==================================================

// DELETE /api/v1/tasks/:id
// Delete a task using its ID after validating the request.
router.delete("/:id", authenticateToken, validateTaskId, deleteTaskHandler);

// Export the router so it can be mounted in the main app.
export default router;
