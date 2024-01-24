import {z} from "zod";

export const createVoterSchema = z.object({
    shareCode: z.string().min(1, {message: "Enter a valid share code."}),
    username: z.string().min(3, {message: "Enter a valid username"}).max(20, {message: "Username must not exceed 20 characters"}),
    email: z.string().email({message: "Enter a valid email"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
    confirmPass: z.string().min(1, {message: "Must confirm the password."}),
});

export const deleteVoterSchema = z.object({
    voterRef: z.string().min(1, {message: "Voter reference must be not empty"}),
    
})