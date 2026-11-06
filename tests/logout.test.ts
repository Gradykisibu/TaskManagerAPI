import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app"

describe("POST /api/v1/auth/logout", () => {
    it("should logout and check token is revoked", async () => {

        const user = {
            email: "logout-test@example.com",
            password: "Password123!"
        }

        const agent = request.agent(app)

        // Register 
        const register = await agent
            .post('/api/v1/auth/register')
            .send(user)

        expect(register.status).toBe(201)

        // Login to obtain refresh cookie
        const login = await agent
            .post("/api/v1/auth/login")
            .send(user)

        expect(login.status).toBe(200)


        // Logout
        const logout = await agent
            .post('/api/v1/auth/logout')
            .send(user)

        expect(logout.status).toBe(200)
        expect(logout.body.success).toBe(true)
        expect(logout.body.message).toBe("Logged out successfully")


        console.log("========== TEST6 DEBUG ==========");
        console.log("STATUS:", login.status);
        console.log("HEADERS:", login.headers);
        console.log("BODY:", JSON.stringify(login.body, null, 2));
        console.log("================================");


        // Check that the server sent a cookie-clearing header
        expect(logout.headers["set-cookie"]).toBeDefined()
    });


    it("should reject a refresh token after logout", async () => {
        const user = {
            email: "logout-revoke-test@example.com",
            password: "Password123!"
        };

        const agent = request.agent(app);

        // Register and login
        await agent
            .post("/api/v1/auth/register")
            .send(user);

        const login = await agent
            .post("/api/v1/auth/login")
            .send(user);

        expect(login.status).toBe(200);

        // Save a copy of the original refresh cookie
        const originalCookie = login.headers["set-cookie"][0];

        // Logout
        const logout = await agent
            .post("/api/v1/auth/logout")
            .send(user)

        expect(logout.status).toBe(200);

        // Attempt to use the copied refresh cookie after logout
        const refresh = await request(app)
            .post("/api/v1/auth/refresh")
            .send(user)
            .set("Cookie", originalCookie);

        expect(refresh.status).toBe(401);
        expect(refresh.body.success).toBe(false);
    });

})