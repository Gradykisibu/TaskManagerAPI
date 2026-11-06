import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
describe("POST /api/v1/auth/register", () => {
    it("This test should register a test user successfully", async () => {
        const res = await request(app).post('/api/v1/auth/register').send({
            email: `test-${Date.now()}@gmail.com`,
            password: "pass@word1"
        });
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User created successfully");
        expect(res.body.data).toBe("test@example.com");
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.createdAt).toBeDefined();
        // expect information must never be returned
        expect(res.body.data.password).toBeUndefined();
    });
});
//# sourceMappingURL=registration.test.js.map