import cors from "cors";

const allowOrigins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if(!origin || allowOrigins.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error("Not allowed by CORS"))
        }
    },

    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"]
}

export default cors(corsOptions)

/*
Understand what's happening
- allowedOrigins: frontend origins allowed to access your API.
- origin: checks whether the incoming browser origin is permitted.
- !origin: allows requests without an Origin header, such as Postman and many server-to-server requests.
- credentials: true: allows browser requests to include cookies.
- methods: specifies which HTTP methods are allowed.
- allowedHeaders: specifies which request headers the browser can send.
*/