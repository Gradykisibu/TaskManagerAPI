"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = createRefreshToken;
exports.validateRefreshToken = validateRefreshToken;
exports.rotateRefreshToken = rotateRefreshToken;
exports.revokeRefreshToken = revokeRefreshToken;
const node_crypto_1 = require("node:crypto");
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const REFRESH_TOKEN_TTL_DAYS = 7;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}
function hashRefreshToken(refreshToken) {
    return (0, node_crypto_1.createHash)("sha256").update(refreshToken).digest("hex");
}
async function createRefreshToken(userId) {
    // Generate a token that is difficult to guess.
    const token = (0, node_crypto_1.randomBytes)(32).toString("hex");
    // Store only its hash in the database.
    const tokenHash = hashRefreshToken(token);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    await prisma_js_1.default.refreshToken.create({
        data: {
            tokenHash,
            userId,
            expiresAt,
        },
    });
    // Return the raw token only to the caller.
    return { token, expiresAt };
}
async function validateRefreshToken(refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    const session = await prisma_js_1.default.refreshToken.findUnique({
        where: { tokenHash }
    });
    if (!session) {
        return null;
    }
    const now = new Date();
    if (session.expiresAt <= now) {
        return null;
    }
    if (session.revokedAt !== null) {
        return null;
    }
    return session;
}
// export async function rotateRefreshToken(refreshToken: string) {
//   const tokenHash = hashRefreshToken(refreshToken);
//   const now = new Date();
// return await prisma.$transaction(
//   async (tx) => {
//     // 1. Find the existing session.
//     const session = await tx.refreshToken.findUnique({
//       where: { tokenHash },
//     });
//     console.log("[SESSION_REFRESH_TOKEN:]", session);
//     // 2. Reject unknown, expired, or revoked sessions.
//     if (
//       !session ||
//       session.expiresAt <= now ||
//       session.revokedAt !== null
//     ) {
//       return null;
//     }
//     // 3. Revoke the old token conditionally.
//     // Only one concurrent request should succeed.
//     const revoked = await tx.refreshToken.updateMany({
//       where: {
//         id: session.id,
//         revokedAt: null,
//         expiresAt: { gt: now },
//       },
//       data: {
//         revokedAt: now,
//       },
//     });
//     if (revoked.count !== 1) {
//       return null;
//     }
//     // 4. Generate a replacement refresh token.
//     const newRefreshToken = randomBytes(32).toString("hex");
//     const newTokenHash = hashRefreshToken(newRefreshToken);
//     const expiresAt = new Date(
//       now.getTime() +
//       REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
//     );
//     await tx.refreshToken.create({
//       data: {
//         tokenHash: newTokenHash,
//         userId: session.userId,
//         expiresAt,
//       },
//     });
//     // 5. Issue a new access token for the same user.
//     const accessToken = jwt.sign(
//       { id: session.userId },
//       JWT_SECRET as string,
//       { expiresIn: "1h" }
//     );
//     // 6. Return credentials to the caller.
//     return {
//       accessToken,
//       refreshToken: newRefreshToken,
//     };
//   });
// }
async function rotateRefreshToken(refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    const now = new Date();
    // Generate replacement credentials
    const newRefreshToken = (0, node_crypto_1.randomBytes)(32).toString("hex");
    const newTokenHash = hashRefreshToken(newRefreshToken);
    const expiresAt = new Date(now.getTime() +
        REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    const userId = await prisma_js_1.default.$transaction(async (tx) => {
        // 1. Find existing session
        const session = await tx.refreshToken.findUnique({
            where: { tokenHash },
        });
        // 2. Validate session
        if (!session ||
            session.expiresAt <= now ||
            session.revokedAt !== null) {
            return null;
        }
        // 3. Revoke old token conditionally
        const revoked = await tx.refreshToken.updateMany({
            where: {
                id: session.id,
                revokedAt: null,
                expiresAt: { gt: now },
            },
            data: {
                revokedAt: now,
            },
        });
        if (revoked.count !== 1) {
            return null;
        }
        // 4. Create replacement token
        await tx.refreshToken.create({
            data: {
                tokenHash: newTokenHash,
                userId: session.userId,
                expiresAt,
            },
        });
        return session.userId;
    }, {
        maxWait: 10000,
        timeout: 20000,
    });
    if (!userId) {
        return null;
    }
    // 5. Generate access token after transaction commits
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
}
async function revokeRefreshToken(refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    const sessionToken = await prisma_js_1.default.refreshToken.findUnique({
        where: { tokenHash }
    });
    if (!sessionToken) {
        return null;
    }
    if (sessionToken.revokedAt !== null) {
        return null;
    }
    await prisma_js_1.default.refreshToken.update({
        where: { id: sessionToken.id },
        data: { revokedAt: new Date() }
    });
    return true;
}
//# sourceMappingURL=refreshToken.service.js.map