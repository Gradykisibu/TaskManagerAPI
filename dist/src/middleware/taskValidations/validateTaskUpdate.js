"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskUpdate = validateTaskUpdate;
const task_validator_js_1 = require("../../validators/tasks/task.validator.js");
function validateTaskUpdate(req, res, next) {
    const result = task_validator_js_1.UpdateTaskSchema.safeParse(req.body);
    if (!result.success) {
        res
            .status(400)
            .json({
            success: false,
            message: "Invalid task update",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        });
        return;
    }
    req.body = result.data;
    next();
}
//# sourceMappingURL=validateTaskUpdate.js.map