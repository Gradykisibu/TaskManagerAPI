"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUserRegistration = ValidateUserRegistration;
exports.ValidateLoginUser = ValidateLoginUser;
exports.authenticateToken = authenticateToken;
const user_validator_js_1 = require("../../validators/users/user.validator.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Get the JWT secret from the environment variables.
// This secret is used to verify that a token was signed by our server.
const JWT_SECRET = process.env.JWT_SECRET;
// Check that the secret exists before the application continues.
// Without it, we cannot securely verify authentication tokens.
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not provided");
}
function ValidateUserRegistration(req, res, next) {
    const result = user_validator_js_1.RegisterUserSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Invalid fields provided",
            error: result.error.issues.map((err) => ({
                field: err.path.join("."),
                message: err.message
            }))
        });
        return;
    }
    req.body = result.data;
    next();
}
function ValidateLoginUser(req, res, next) {
    console.log("[VALIDATE_LOGIN_USER]:", req.body);
    const result = user_validator_js_1.LoginUserSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Invalid fields provided",
            error: result.error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
        return;
    }
    req.body = result.data;
    next();
}
// Middleware that checks whether a request contains a valid JWT.
// req = the incoming request from the client
// res = the response we send back to the client
// next = tells Express to continue to the next middleware or route handler
async function authenticateToken(req, res, next) {
    // Read the Authorization header from the incoming request.
    // A client usually sends a token in this format:
    // Authorization: Bearer your_jwt_token_here
    const authHeader = req.headers.authorization;
    // Check whether the Authorization header exists and starts with "Bearer ".
    // The ?. prevents an error if authHeader is undefined.
    // If the header is missing or uses the wrong format, reject the request.
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Authentication token is required"
        });
        // Stop here so the request cannot continue without a token.
        return;
    }
    // Remove "Bearer " from the beginning of the header.
    // This leaves us with just the actual JWT.
    const token = authHeader.slice("Bearer ".length);
    try {
        // Verify the token using our secret.
        // This checks the token's signature and expiration (if an expiry
        // was set when the token was created).
        // If verification fails, jwt.verify() throws an error.
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("[payload]:", payload);
        // Make sure the decoded token contains a valid userId.
        //
        // 1. typeof payload === "string":
        //    Reject tokens whose decoded payload is a string rather than
        //    an object containing user information.
        //
        // 2. typeof payload.userId !== "number":
        //    The userId must be a number.
        //
        // 3. !Number.isSafeInteger(payload.userId):
        //    The userId must be a whole number within JavaScript's safe
        //    integer range.
        //
        // 4. payload.userId <= 0:
        //    Reject zero and negative IDs. We expect a positive user ID.
        if (typeof payload === "string" ||
            typeof payload.id !== "number" ||
            !Number.isSafeInteger(payload.id) ||
            payload.id <= 0) {
            // The token was verified, but its userId is not acceptable.
            res.status(401).json({
                success: false,
                message: "Invalid authentication token",
            });
            // Stop the request because the user ID is invalid.
            return;
        }
        // Attach the verified user ID to the request object.
        // Other middleware or route handlers can now access it using:
        // (req as AuthenticatedRequest).userId
        req.id = payload.id;
        // Authentication succeeded!
        // Pass control to the next middleware or route handler.
        next();
    }
    catch (error) {
        // This runs if token verification fails, for example because
        // the token is malformed, has an invalid signature, or has expired.
        // Return 401 Unauthorized to tell the client authentication failed.
        res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });
    }
}
//# sourceMappingURL=validateUser.js.map