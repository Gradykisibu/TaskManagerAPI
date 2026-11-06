import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("POST /api/v1/auth/register", () => {
    it("should register a test user successfully and reject duplicate emails", async () => {
        const user = {
            email: "duplicate13@example.com",
            password: "Password123"
        };

        // 1. First request: Should succeed (201 Created)
        const firstResponse = await request(app)
            .post("/api/v1/auth/register")
            .send(user);

        expect(firstResponse.status).toBe(201);
        expect(firstResponse.body.success).toBe(true);
        expect(firstResponse.body.data.email).toBe(user.email);
        expect(firstResponse.body.data.id).toBeDefined();
        expect(firstResponse.body.data.password).toBeUndefined();

        // 2. Second request (same test block): Should fail with conflict (409 Conflict)
        const secondResponse = await request(app)
            .post("/api/v1/auth/register")
            .send(user);

        expect(secondResponse.status).toBe(409);
        expect(secondResponse.body.success).toBe(false);
        expect(secondResponse.body.message).toBe(
            "Email provided has already been used"
        );
    });
});