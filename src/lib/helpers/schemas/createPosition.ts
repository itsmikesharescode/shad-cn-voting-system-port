
import {z} from "zod";

export const createPositionSchema = z.object({
    position: z.string().min(1, {message: "Position must be not empty"}).max(50, {message: "Position must be less than 50 characters"}),
    voteLimit: z.string().min(1, {message: "Vote limit must be not empty"}).max(5, {message: "Vote limit must be less than 5 characters"}),
});
