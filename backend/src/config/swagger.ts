
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PlaceTrack API",
      version: "1.0.0",
      description:
        "API documentation for the PlaceTrack Student Placement Management System",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    
schemas: {
  CreateStudent: {
    type: "object",
    description: "Student fields accepted by createStudentSchema",
    properties: {
      name: { type: "string", example: "Aarav Patil" },
      email: { type: "string", format: "email", example: "aarav@example.com" },
      rollNumber: { type: "string", example: "CSE2027002" },
      branch: { type: "string", example: "Computer Science" },
      year: { type: "integer", example: 4 },
    },
  },
},

  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
