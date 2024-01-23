import {z} from "zod";

export const joinCodeSchema = z.object({
    shareCode: z.string().min(1, {message: "Enter a valid join code."}),
})