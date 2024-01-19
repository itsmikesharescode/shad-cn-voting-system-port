
import {z} from "zod";

export const createCandidateSchema = z.object({
    position: z.string().min(1, {message: "Position must be not empty"}).max(200, {message: "Position must be less than 200 characters"}),
    candidateName: z.string().min(1, {message: "Candidate name must be not empty"}).max(50, {message: "Candidate name must be less than 50 characters"}),
    organization: z.string().min(1, {message: "Organization must be not empty"}).max(50, {message: "Organization must be less than 50 characters"}),
    agenda: z.string().min(1, {message: "Agenda must be not empty"}).max(50, {message: "Agenda must be less than 50 characters"}),
});

export const deleteCandidateSchema = z.object({
    candidateRef: z.string().min(1, {message: "Candidate reference must be not empty"}).max(300, {message: "Candidate reference must be less than 300 characters"}),
})