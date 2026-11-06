"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_service_1 = require("../token/refreshToken.service");
// Get our Secret key in our .env and keep it here
const JWT_SECRET = process.env.JWT_SECRET;
// Validate if the JWT exist in our .env, if not then throw an error
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}
// Create the login function 
async function loginUser(email, password) {
    // 1.Find the user: looks up their normalized email in PostgreSQL.
    const user = await prisma_js_1.default.user.findUnique({
        where: {
            email: email.trim().toLowerCase(),
        },
    });
    // Validate: confirm is the user exist in our database, do not return the user yet
    // return error or null if user does not exist
    if (!user) {
        throw new Error("User does not exist");
    }
    // If user exist thn compare passwords 
    // Verify the password: using bcrypt.compare() compares the submitted password against the stored hash. 
    // We never decrypt or retrieve the original password.
    const passwordMatches = await bcrypt_1.default.compare(password, user.password);
    // Validate: If passwords do not match then return null or an error message
    // Reject invalid credentials: returns null for either a nonexistent email or an incorrect password.
    if (!passwordMatches) {
        throw new Error("Password is incorrect");
    }
    // Sign a JWT: includes the user's ID and sets the token to expire after one hour.
    const accessToken = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
    const refreshSession = await (0, refreshToken_service_1.createRefreshToken)(user.id);
    // Return safe user data: never returns the stored password hash.
    return {
        accessToken,
        user: {
            id: user?.id,
            email: user?.email,
            createdAt: user?.createdAt
        },
        refreshToken: refreshSession.token,
    };
}
//# sourceMappingURL=login.service.js.map