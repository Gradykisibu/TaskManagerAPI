import type { Response, Request, NextFunction } from "express";
import { registerUser, getUsers } from "../../services/auth/auth.service.js";
import { loginUser } from "../../services/auth/login.service.js";
import { rotateRefreshToken, revokeRefreshToken } from "../../services/token/refreshToken.service.js";

import { Prisma } from "../../../generated/prisma/client.js";

export async function RegisterUserHandler(req: Request, res: Response, next: NextFunction): Promise<void> {

    // Now TypeScript knows result.success is true, so result.data is safe to use
    const { email, password } = req.body

    try {
        // Assuming registerUser is an async function that writes to the database
        const newUser = await registerUser(email, password)

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({
                success: false,
                message: "Email provided has already been used"
            });

            return;
        }
        next(error)
    }
}

export async function GetAllUsersHandler(_req: Request, res: Response, next: NextFunction) {
    try {
        return res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: getUsers()
        })
    } catch (error) {
        next(error)
    }
}

export async function loginRegisterUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body

        const loggedUser = await loginUser(email, password)

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

    } catch (error: unknown) {
        console.log("Cannot log user", error);

        if (error instanceof Error) {
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
        }

        next(error);
    }
}

export async function logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies?.refreshToken

        if (refreshToken) {
            await revokeRefreshToken(refreshToken)
        }

    } catch (error) {
        next(error)
        return;
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/api/v1/auth",
    })

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}

export async function refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
        res.status(401).json({
            success: false,
            message: "Refresh token is missing"
        });

        return;
    };

    const result = await rotateRefreshToken(refreshToken)

    if (!result) {
        res.status(401).json({
            success: false,
            message: "Refresh token is invalid, expired or revoked"
        })
    }

    res.cookie("refreshToken", result?.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/api/v1/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        success: true,
        token: result?.accessToken
    })
}