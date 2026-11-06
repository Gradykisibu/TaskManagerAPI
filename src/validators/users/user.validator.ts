import { z } from "zod"

export const RegisterUserSchema = z.object({
    email: z.string()
    // removes surrounding whitespace.
    .trim()
    // rejects invalid email formats.
    .email("A valid email address is required") 
    // normalizes the email.
    .transform((email) => email.toLocaleLowerCase()),

    password: z.string()
    .trim()
    .min(8, "Password should be at least 8 characters")
    .max(75, "Password must not exceed 75 characters")
})
// rejects unexpected fields.
.strict()

export const LoginUserSchema = z.object({
    email: z.string()
    .trim()
    .email("a valid email is required")
    .transform((email) => email.trim().toLocaleLowerCase()),

    password: z.string()
    .trim()
    .min(8, "Password should be at least 8 characters")
    .max(75, "Password must not exceed 75 characters")
}).strict()

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>
export type LoginUserInput = z.infer<typeof LoginUserSchema>