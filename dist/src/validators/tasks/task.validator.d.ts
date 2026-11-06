import { z } from "zod";
export declare const CreateTaskSchema: z.ZodObject<{
    title: z.ZodString;
}, z.core.$strict>;
export declare const UpdateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    completed: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
//# sourceMappingURL=task.validator.d.ts.map