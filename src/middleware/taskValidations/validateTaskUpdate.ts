import type { Response, Request, NextFunction } from "express";
import { UpdateTaskSchema } from "../../validators/tasks/task.validator.js";

export function validateTaskUpdate(req: Request, res:Response, next:NextFunction):void {
    const result = UpdateTaskSchema.safeParse(req.body)

    if(!result.success){
        res
        .status(400)
        .json({
            success:false,
            message:"Invalid task update",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        })

        return
    }

    req.body = result.data

    next()
}