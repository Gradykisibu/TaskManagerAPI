
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description: "Task Manager REST API documentation"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ]
    },
    apis: ["./src/config/openapi.yaml"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
