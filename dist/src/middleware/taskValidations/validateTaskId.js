"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskId = validateTaskId;
function validateTaskId(req, res, next) {
    const id = Number(req.params.id);
    if (id <= 0 || !Number.isInteger(id)) {
        res
            .status(400)
            .json({
            success: false,
            message: "invalid ID format."
        });
        return;
    }
    ;
    next();
}
//# sourceMappingURL=validateTaskId.js.map