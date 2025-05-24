// swagger.config.ts
import { SwaggerDefinition, Options } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.1.1",
  info: {
    title: "Abipulli API",
    version: "1.0.0",
    description: "API documentation for the Abipulli API",
  },
  servers: [
    {
      url: "http://localhost:55116",
    },
  ],
};

export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: ["./src/**/*.route.ts"],
};
