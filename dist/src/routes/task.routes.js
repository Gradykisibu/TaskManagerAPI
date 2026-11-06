"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_js_1 = require("../controllers/tasks/task.controller.js");
// import { validateUser } from "../middleware/taskValidations/validateUser";
const validateTaskUpdate_js_1 = require("../middleware/taskValidations/validateTaskUpdate.js");
const validateTaskId_js_1 = require("../middleware/taskValidations/validateTaskId.js");
const validateTask_js_1 = require("../middleware/taskValidations/validateTask.js");
const validateUser_js_1 = require("../middleware/userValidations/validateUser.js");
// Create a router instance to register task-related routes.
const router = (0, express_1.Router)();
// ==================================================
// GET ROUTES
// ==================================================
// GET /api/v1/tasks
// Fetch all tasks.
// validateUser checks the request before the controller runs.
router.get("/", validateUser_js_1.authenticateToken, task_controller_js_1.getTasksHandler);
// GET /api/v1/tasks/:id
// Fetch a specific task using its ID.
router.get("/:id", validateUser_js_1.authenticateToken, validateTaskId_js_1.validateTaskId, task_controller_js_1.getTaskByIdHandler);
// ==================================================
// POST ROUTES
// ==================================================
// POST /api/v1/tasks
// Create a new task after validating the submitted title.
router.post("/", validateUser_js_1.authenticateToken, validateTask_js_1.validateTask, task_controller_js_1.createTaskHandler);
// ==================================================
// PATCH ROUTES
// ==================================================
// PATCH /api/v1/tasks/:id
// Update an existing task after validating the request
// and checking the submitted update data.
router.patch("/:id", validateUser_js_1.authenticateToken, validateTaskId_js_1.validateTaskId, validateTaskUpdate_js_1.validateTaskUpdate, task_controller_js_1.updateTaskHandler);
// ==================================================
// DELETE ROUTES
// ==================================================
// DELETE /api/v1/tasks/:id
// Delete a task using its ID after validating the request.
router.delete("/:id", validateUser_js_1.authenticateToken, validateTaskId_js_1.validateTaskId, task_controller_js_1.deleteTaskHandler);
// Export the router so it can be mounted in the main app.
exports.default = router;
//# sourceMappingURL=task.routes.js.map