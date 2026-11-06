"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const allowOrigins = [
    "http://localhost:5173",
    "http://localhost:3000"
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"]
};
exports.default = (0, cors_1.default)(corsOptions);
/*
Understand what's happening
- allowedOrigins: frontend origins allowed to access your API.
- origin: checks whether the incoming browser origin is permitted.
- !origin: allows requests without an Origin header, such as Postman and many server-to-server requests.
- credentials: true: allows browser requests to include cookies.
- methods: specifies which HTTP methods are allowed.
- allowedHeaders: specifies which request headers the browser can send.
*/ 
//# sourceMappingURL=cors.middleware.js.map