"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const task_routes_js_1 = __importDefault(require("./routes/task.routes.js"));
const users_routes_js_1 = __importDefault(require("./routes/users.routes.js"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_js_1 = __importDefault(require("./config/swagger.js"));
const requestLogger_js_1 = require("./middleware/requestLogger.js");
const apiVersion_js_1 = require("./middleware/apiVersion.js");
const cors_middleware_js_1 = __importDefault(require("./middleware/cors.middleware.js"));
const app = (0, express_1.default)();
// General middleware: register before routes.
app.use(requestLogger_js_1.requestLogger);
app.use(apiVersion_js_1.apiVersion);
app.use(cors_middleware_js_1.default);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use(globalLimiter);
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Task manager API is running",
    });
});
// Task routes
app.use("/api/v1/tasks", task_routes_js_1.default);
// User routes
app.use('/api/v1/auth', users_routes_js_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.default));
app.use((error, req, res, next) => {
    console.error("========== GLOBAL ERROR ==========");
    console.error(error);
    console.error("===================================");
    if (res.headersSent) {
        return next(error);
    }
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map