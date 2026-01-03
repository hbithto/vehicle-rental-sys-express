import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

const openApiRegistry = new OpenAPIRegistry();

openApiRegistry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

export { openApiRegistry };
