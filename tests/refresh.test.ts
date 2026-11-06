import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app"


describe("POST /api/v1/auth/refresh", () => {

    it("should refresh an access token successfully", async () => {
        const user: { email: string, password: string } = {
            email: "refresh-test@gmail.com",
            password: "password1234"
        }

        // 1. Create the persistent agent
        const agent = request.agent(app);

        // Register user
        const registration = await agent
            .post("/api/v1/auth/register")
            .send(user);

        console.log("========== TEST1 DEBUG ==========");
        console.log("STATUS:", registration.status);
        console.log("BODY:", JSON.stringify(registration.body, null, 2));
        console.log("================================");

        expect(registration.status).toBe(201);

        // Attempt a login to obtain refresh cookie
        const userRes = await agent
            .post("/api/v1/auth/login")
            .send(user)

        console.log("========== TEST2 DEBUG ==========");
        console.log("STATUS:", userRes.status);
        console.log("BODY:", JSON.stringify(userRes.body, null, 2));
        console.log("================================");

        expect(userRes.status).toBe(200)
        expect(userRes.body.token).toBeDefined()
        expect(userRes.body.user.id).toBeDefined()

        // Use refresh cookie to obtain a new access token
        const newToken = await agent
            .post("/api/v1/auth/refresh")
            .send(user)

        console.log("========== TEST3 DEBUG ==========");
        console.log("STATUS:", newToken.status);
        console.log("BODY:", JSON.stringify(newToken.body, null, 2));
        console.log("================================");

        expect(newToken.status).toBe(200)
        expect(newToken.body.success).toBe(true);
        expect(newToken.body.token).toBeDefined();
        expect(newToken.headers["set-cookie"]).toBeDefined();
    });

    it("should reject reuse of an old refresh token", async () => {
        const user = {
            email: "refresh-rotation-test@example.com",
            password: "password123"
        }

        const agent = request.agent(app)

        // Register and login
        await agent
            .post("/api/v1/auth/register")
            .send(user)

        const login = await agent
            .post("/api/v1/auth/login")
            .send(user)

        expect(login.status).toBe(200)

        console.log("========== TEST6 DEBUG ==========");
        console.log("STATUS:", login.status);
        console.log("HEADERS:", login.headers);
        console.log("BODY:", JSON.stringify(login.body, null, 2));
        console.log("================================");

        // Save the original refresh cookie
        const originalCookie = login.headers["set-cookie"][0]

        // Refresh once: this should rotate the token
        const firstRefreshToken = await agent
            .post("/api/v1/auth/refresh")
            .send(user)

        console.log("========== TEST7 DEBUG ==========");
        console.log("STATUS:", firstRefreshToken.status);
        console.log("HEADERS:", firstRefreshToken);
        console.log("BODY:", JSON.stringify(firstRefreshToken.body, null, 2));
        console.log("================================");
        expect(firstRefreshToken.status).toBe(200);

        // Try reusing the original token manually
        const secondRefresh = await request(app)
            .post("/api/v1/auth/refresh")
            .send(user)
            .set("Cookie", originalCookie);

        console.log("========== TEST7 DEBUG ==========");
        console.log("STATUS:", secondRefresh.status);
        console.log("HEADERS:", secondRefresh);
        console.log("BODY:", JSON.stringify(secondRefresh.body, null, 2));
        console.log("================================");

        expect(secondRefresh.status).toBe(401);
        expect(secondRefresh.body.success).toBe(false);
    });
});