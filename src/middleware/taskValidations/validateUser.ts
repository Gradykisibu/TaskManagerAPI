import type { Response, Request, NextFunction } from "express";

export function validateUser(req: Request, res:Response, next:NextFunction){
    const isLoggedIn = true

    if(!isLoggedIn){
        return res.status(400).json({
            message:"You are not loggedIn"
        })
    };

    next()
}