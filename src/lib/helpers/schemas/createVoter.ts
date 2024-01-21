import {z} from "zod";

export const createVoterSchema = z.object({
    username: z.string().min(3, {message: "Enter a valid username"}).max(20, {message: "Username must not exceed 20 characters"}),
    email: z.string().email({message: "Enter a valid email"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPassword: z.string().min(1, {message: "Must confirm the password."}),
})