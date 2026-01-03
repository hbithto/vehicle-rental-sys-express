import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { openApiRegistry } from "./registry";
import swaggerUi from "swagger-ui-express";
import config from "~/config";

const serverUrl = `${config.env === "production" ? `https://${config.host}` : `http://${config.host}:${config.port}`}`;
const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

export const document = generator.generateDocument({
    openapi: "3.0.0",
    info: { title: "Vehicle Rental System API", version: "1.0.0" },
    servers: [{ url: serverUrl }],
    security: [{ bearerAuth: [] }],
});

export const swaggerMiddleware = [
    swaggerUi.serve,
    swaggerUi.setup(document),
];
