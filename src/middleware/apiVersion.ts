import type { Response, Request, NextFunction } from "express"

export function apiVersion (req: Request, res:Response, next:NextFunction):void {
    res.setHeader("X-API-Version", "1.0")

    next()
}