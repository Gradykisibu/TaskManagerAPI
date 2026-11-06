import { z } from "zod";

// Schema for validating data when creating a new task
export const CreateTaskSchema = z
  .object({
    // Title must be a string, remove whitespace from both ends,
    // and contain at least one character after trimming
    title: z.string().trim().min(1, "Title is required"),
  })
  // Reject any extra fields that are not defined in the schema
  // For example, { title: "Study", priority: "high" } will be rejected
  .strict();


// Schema for validating data when updating an existing task
export const UpdateTaskSchema = z
  .object({
    // If provided, title must be a non-empty string after trimming
    title: z.string().trim().min(1, "Title is required"),

    // If provided, completed must be a boolean (true or false)
    completed: z.boolean()
  })
  // Make all fields optional so the client can update only one field
  // For example, { title: "New title" } or { completed: true }
  .partial()
  // Reject fields that are not defined in the schema
  .strict()
  // Require at least one field to be provided in the update request
  // Reject an empty object: {}
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least 1 field is required"
    }
  );

// Derive the TypeScript type from the CreateTaskSchema
// This keeps the type aligned with the schema's validated data
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
