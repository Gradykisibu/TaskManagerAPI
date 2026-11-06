"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many request attempts. Please try again later."
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
});
//# sourceMappingURL=rateLimit.middleware.js.map