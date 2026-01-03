import { registerSwaggerRoute } from "./route";
import { AuthValidation } from "~/modules/auth/auth.validation";
import { UserValidation } from "~/modules/users/user.validation";
import { VehicleValidation } from "~/modules/vehicles/vehicle.validation";
import { BookingValidation } from "~/modules/bookings/booking.validation";

/**
 * Auth Routes
 */
registerSwaggerRoute({
    method: "post",
    path: "/api/v1/auth/signup",
    tags: ["Auth"],
    schema: AuthValidation.signupSchema,
    responses: {
        "201": { description: "User registered successfully" },
        "400": { description: "Bad request - validation error" },
        "409": { description: "User already exists" },
    },
    security: [],
});

registerSwaggerRoute({
    method: "post",
    path: "/api/v1/auth/signin",
    tags: ["Auth"],
    schema: AuthValidation.signinSchema,
    responses: {
        "200": { description: "User logged in successfully" },
        "400": { description: "Bad request - validation error" },
        "401": { description: "Invalid credentials" },
    },
    security: [],
});

/**
 * User Routes
 */
registerSwaggerRoute({
    method: "get",
    path: "/api/v1/users",
    tags: ["Users"],
    responses: {
        "200": { description: "Users retrieved successfully" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - admin only" },
    },
});

registerSwaggerRoute({
    method: "put",
    path: "/api/v1/users/{userId}",
    tags: ["Users"],
    schema: UserValidation.updateUserSchema,
    responses: {
        "200": { description: "User updated successfully" },
        "400": { description: "Bad request - validation error" },
        "401": { description: "Unauthorized" },
        "404": { description: "User not found" },
    },
});

registerSwaggerRoute({
    method: "delete",
    path: "/api/v1/users/{userId}",
    tags: ["Users"],
    responses: {
        "200": { description: "User deleted successfully" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - admin only" },
        "404": { description: "User not found" },
    },
});

/**
 * Vehicle Routes
 */
registerSwaggerRoute({
    method: "post",
    path: "/api/v1/vehicles",
    tags: ["Vehicles"],
    schema: VehicleValidation.createVehicleSchema,
    responses: {
        "201": { description: "Vehicle created successfully" },
        "400": { description: "Bad request - validation error" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - admin only" },
    },
});

registerSwaggerRoute({
    method: "get",
    path: "/api/v1/vehicles",
    tags: ["Vehicles"],
    responses: {
        "200": { description: "Vehicles retrieved successfully" },
    },
    security: [],
});

registerSwaggerRoute({
    method: "get",
    path: "/api/v1/vehicles/{vehicleId}",
    tags: ["Vehicles"],
    responses: {
        "200": { description: "Vehicle retrieved successfully" },
        "404": { description: "Vehicle not found" },
    },
    security: [],
});

registerSwaggerRoute({
    method: "put",
    path: "/api/v1/vehicles/{vehicleId}",
    tags: ["Vehicles"],
    schema: VehicleValidation.updateVehicleSchema,
    responses: {
        "200": { description: "Vehicle updated successfully" },
        "400": { description: "Bad request - validation error" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - admin only" },
        "404": { description: "Vehicle not found" },
    },
});

registerSwaggerRoute({
    method: "delete",
    path: "/api/v1/vehicles/{vehicleId}",
    tags: ["Vehicles"],
    responses: {
        "200": { description: "Vehicle deleted successfully" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden - admin only" },
        "404": { description: "Vehicle not found" },
    },
});

/**
 * Booking Routes
 */
registerSwaggerRoute({
    method: "post",
    path: "/api/v1/bookings",
    tags: ["Bookings"],
    schema: BookingValidation.createBookingSchema,
    responses: {
        "201": { description: "Booking created successfully" },
        "400": { description: "Bad request - validation error" },
        "401": { description: "Unauthorized" },
    },
});

registerSwaggerRoute({
    method: "get",
    path: "/api/v1/bookings",
    tags: ["Bookings"],
    responses: {
        "200": { description: "Bookings retrieved successfully" },
        "401": { description: "Unauthorized" },
    },
});

registerSwaggerRoute({
    method: "put",
    path: "/api/v1/bookings/{bookingId}",
    tags: ["Bookings"],
    schema: BookingValidation.updateBookingSchema,
    responses: {
        "200": { description: "Booking updated successfully" },
        "400": { description: "Bad request - validation error" },
        "401": { description: "Unauthorized" },
        "404": { description: "Booking not found" },
    },
});
