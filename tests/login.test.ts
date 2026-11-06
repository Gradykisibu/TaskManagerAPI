import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app"

describe("POST /api/v1/auth/login", () => {
    it("Should login a user and return user data with an access token", async () => {

        // User details we will use to login
        const user = {
            email: "testlogin1@example.com",
            password: "Password123"
        }

        // Register a user first
        const registeredUser = await request(app)
            .post('/api/v1/auth/register')
            .send(user)

        console.log("========== TEST1 DEBUG ==========");
        console.log("STATUS:", registeredUser.status);
        console.log("BODY:", JSON.stringify(registeredUser.body, null, 2));
        console.log("================================");

        expect(registeredUser.status).toBe(201)
        expect(registeredUser.body.message).toBe("User created successfully")

        // Attempt a login
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send(user)

        console.log("========== TEST2 DEBUG ==========");
        console.log("STATUS:", res.status);
        console.log("BODY:", JSON.stringify(res.body, null, 2));
        console.log("================================");

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.token).toBeDefined()
        expect(res.body.user.email).toBe(user.email)
        expect(res.body.user.id).toBeDefined()


        // Check that a refresh-token cookie was set
        expect(res.headers["set-cookie"]).toBeDefined()
    });

    it("should reject login with an incorrect password", async () => {
        const user = {
            email: "wrong-password-test@example.com",
            password: "Password123!"
        };

        // Register user before login
        const registeredUser = await request(app)
        .post("/api/v1/auth/register")
        .send(user)

        expect(registeredUser.status).toBe(201)
        expect(registeredUser.body.data.id).toBeDefined()
        expect(registeredUser.body.message).toBe("User created successfully")

        // Login user with incorrect password
        const loginUser = await request(app)
        .post("/api/v1/auth/login")
        .send({
            email: user.email,
            password:"wrongPassword123"
        });

        expect(loginUser.status).toBe(401);
        expect(loginUser.body.success).toBe(false);
        expect(loginUser.body.token).toBeUndefined();
    })
})
