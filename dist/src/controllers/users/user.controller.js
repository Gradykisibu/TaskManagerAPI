"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserHandler = RegisterUserHandler;
exports.GetAllUsersHandler = GetAllUsersHandler;
exports.loginRegisterUser = loginRegisterUser;
exports.logoutUser = logoutUser;
exports.refreshAccessToken = refreshAccessToken;
const auth_service_js_1 = require("../../services/auth/auth.service.js");
const login_service_js_1 = require("../../services/auth/login.service.js");
const refreshToken_service_js_1 = require("../../services/token/refreshToken.service.js");
const client_js_1 = require("../../../generated/prisma/client.js");
async function RegisterUserHandler(req, res, next) {
    // Now TypeScript knows result.success is true, so result.data is safe to use
    const { email, password } = req.body;
    try {
        // Assuming registerUser is an async function that writes to the database
        const newUser = await (0, auth_service_js_1.registerUser)(email, password);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    }
    catch (error) {
        if (error instanceof client_js_1.Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({
                success: false,
                message: "Email provided has already been used"
            });
            return;
        }
        next(error);
    }
}
async function GetAllUsersHandler(_req, res, next) {
    try {
        return res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: (0, auth_service_js_1.getUsers)()
        });
    }
    catch (error) {
        next(error);
    }
}
async function loginRegisterUser(req, res, next) {
    try {
        const { email, password } = req.body;
        const loggedUser = await (0, login_service_js_1.loginUser)(email, password);
        res.cookie("refreshToken", loggedUser.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/api/v1/auth",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            token: loggedUser.accessToken,
            user: loggedUser.user,
        });
    }
    catch (error) {
        console.log("Cannot log user", error);
        if (error.message === "User does not exist") {
            res.status(401).json({
                success: false,
                message: "Invalid email, User does not exist please signup"
            });
            return;
        }
        if (error.message === "Password is incorrect") {
            res.status(401).json({
                success: false,
                message: "Password entered is incorrect"
            });
            return;
        }
        next(error);
    }
}
async function logoutUser(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await (0, refreshToken_service_js_1.revokeRefreshToken)(refreshToken);
        }
    }
    catch (error) {
        next(error);
        return;
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/api/v1/auth",
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}
async function refreshAccessToken(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.status(401).json({
            success: false,
            message: "Refresh token is missing"
        });
        return;
    }
    ;
    const result = await (0, refreshToken_service_js_1.rotateRefreshToken)(refreshToken);
    if (!result) {
        res.status(401).json({
            success: false,
            message: "Refresh token is invalid, expired or revoked"
        });
    }
    res.cookie("refreshToken", result?.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/api/v1/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
        success: true,
        token: result?.accessToken
    });
}
//# sourceMappingURL=user.controller.js.map