import type { Response, Request, NextFunction } from "express";
import { CreateTaskSchema } from "../../validators/tasks/task.validator.js";

export function validateTask(req: Request, res: Response, next: NextFunction): void {
    // const { title } = req.body

    // using createSchemaTask.parse(req.body) : Validates actual data against the schema at runtime and returns the validated data, or throws an error.
    const result = CreateTaskSchema.safeParse(req.body)
    console.log("[ZOD_RESULTS]:", result)

    // Check whether validation failed
    /*
    we only get 3 properties from result/zod
    - data
    - success
    - error

     */
    if (!result.success) {
        res
            .status(400)
            .json({
                success: false,
                message: "Invalid title required, please provide a string title",

                // You access the validation errors with result.error.issues.
                // error: result.error.issues,
                // type: result.error.type
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            })

        return;
    }

    // If passed then return the validated data
    // You access the title with result.data.title.
    // Replace the original body with Zod's parsed data.

    req.body = result.data

    // Continue to the next middleware or controller.
    next()
}