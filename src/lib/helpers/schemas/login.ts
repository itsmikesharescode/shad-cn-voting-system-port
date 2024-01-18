import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {message: "Password is required."})
});

export const registerSchema = z.object({
    role: z.string().min(1, {message: "Role is required."}).max(10, {message: "Role must be less than 10 characters long."}),
    username: z.string().min(1, {message: "Username is required."}).max(20, {message: "Username must be less than 20 characters long."}),
    email: z.string().email().max(60, {message: "Email must be less than 60 characters long."}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long."}).max(20, {message: "Password must be less than 20 characters long."}),
    confirmPass: z.string().min(1, {message: "Must confirm your password."}),
});

export const resetPassSchema = z.object({
    email: z.string().email(),
})