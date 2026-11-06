import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many request attempts. Please try again later."
    },
    standardHeaders: "draft-8",
    legacyHeaders: false
})