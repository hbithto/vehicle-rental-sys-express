import { openApiRegistry } from "./registry";
import { ZodType } from "zod";

type RouteConfig = {
    method: "get" | "post" | "put" | "delete" | "patch";
    path: string;
    tags: string[];
    schema?: ZodType;
    responses: Record<string, any>;
    security?: Record<string, string[]>[];
};

export const registerSwaggerRoute = ({
    method,
    path,
    tags,
    schema,
    responses,
    security,
}: RouteConfig) => {
    const pathConfig: any = {
        method,
        path,
        tags,
        responses,
    };

    if (schema) {
        pathConfig.request = { body: { content: { "application/json": { schema } } } };
    }

    if (security) {
        pathConfig.security = security;
    }

    openApiRegistry.registerPath(pathConfig);
};
