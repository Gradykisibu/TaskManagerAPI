import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
describe('GET /health', () => {
    it("should return API health status", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "Task manager API is running"
        });
    });
});
/*
Code	        Purpose
describe()	    Groups related tests together
it()	        Defines one test case
request(app)	Creates an HTTP test request against Express
.get("/health")	Sends a GET request
expect()	    Checks whether the actual result matches expectations
.toBe(200)	    Checks the HTTP status
.toEqual()	    Checks the response body
*/ 
//# sourceMappingURL=health.test.js.map