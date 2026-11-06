import { z } from "zod";
export declare const RegisterUserSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strict>;
export declare const LoginUserSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strict>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
//# sourceMappingURL=user.validator.d.ts.map