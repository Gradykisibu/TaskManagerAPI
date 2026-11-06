"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserSchema = exports.RegisterUserSchema = void 0;
const zod_1 = require("zod");
exports.RegisterUserSchema = zod_1.z.object({
    email: zod_1.z.string()
        // removes surrounding whitespace.
        .trim()
        // rejects invalid email formats.
        .email("A valid email address is required")
        // normalizes the email.
        .transform((email) => email.toLocaleLowerCase()),
    password: zod_1.z.string()
        .trim()
        .min(8, "Password should be at least 8 characters")
        .max(75, "Password must not exceed 75 characters")
})
    // rejects unexpected fields.
    .strict();
exports.LoginUserSchema = zod_1.z.object({
    email: zod_1.z.string()
        .trim()
        .email("a valid email is required")
        .transform((email) => email.trim().toLocaleLowerCase()),
    password: zod_1.z.string()
        .trim()
        .min(8, "Password should be at least 8 characters")
        .max(75, "Password must not exceed 75 characters")
}).strict();
//# sourceMappingURL=user.validator.js.map