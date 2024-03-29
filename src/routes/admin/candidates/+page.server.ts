import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { ZodError } from "zod";
import { createCandidateSchema, deleteCandidateSchema } from "$lib/helpers/schemas/createCandidate";
import type { CreatedCandidateTB, CreatedPositionTB } from "$lib/types";
import type { PostgrestError } from "@supabase/supabase-js";

const queryCreatedPosition = "id, created_at, position_name, vote_limit, share_code";
const queryCreatedCandidate = "id, created_at, position_name, share_code, candidate_name, candidate_organization, candidate_agenda";

export const actions: Actions = {

    createCandidate: async ({request, locals: {supabase, getSession}}) => 
    {
        const formData = Object.fromEntries(await request.formData());
        try {
            const result = createCandidateSchema.parse(formData);
            const positionRef: CreatedPositionTB = JSON.parse(result.position);
            const session = await getSession();

            if(session){

                const {data, error} = await supabase.rpc("check_if_candidate_exist", {input_value: result.candidateName}) as {data: boolean, error: PostgrestError | null};

                if(data) return fail(402, {msg: "Candidate already exist."});
                else {
                    const {error: insertCandidateError} = await supabase.from("created_candidate").insert([{
                        position_id: positionRef.id,
                        candidate_name: result.candidateName,
                        candidate_organization: result.organization,
                        candidate_agenda: result.agenda,
                        position_name: positionRef.position_name,
                        user_id: session.user.id,
                        share_code: session.user.user_metadata.share_code,

                    }]).match({share_code: positionRef.share_code, user_id: session.user.id});

                    if(insertCandidateError) return fail(402, {msg: insertCandidateError.message});
                    else {
                        const {data: createdCandidates, error: createdCandidatesError} = await supabase.from("created_candidate").select(queryCreatedCandidate)
                        .match({share_code: session.user.user_metadata.share_code, user_id: session.user.id});

                        if(createdCandidatesError) return fail(402, {msg: createdCandidatesError.message});
                        else if(createdCandidates) return fail(200, {msg: "Successfully created a candidate", session, createdCandidates});
                    };
                };
                

            }else throw redirect(302, "/login?no-session");

            
        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            console.log(fieldErrors)
            return fail(403, {errors: fieldErrors});
        }
    },

    deleteCandidate: async ({request, locals: {supabase, getSession}}) => 
    {
        const formData = Object.fromEntries(await request.formData());
        try {
            const result = deleteCandidateSchema.parse(formData);
            const candidateRef: CreatedCandidateTB = JSON.parse(result.candidateRef);
            const session = await getSession();

            if(session){

                const {error: deleteCandidateError} = await supabase.from("created_candidate").delete()
                .match({id: candidateRef.id, user_id: session.user.id, share_code: session.user.user_metadata.share_code});

                if(deleteCandidateError) return fail(402, {msg: deleteCandidateError.message});
                else {
                    const {data: createdCandidates, error: createdCandidatesError} = await supabase.from("created_candidate").select(queryCreatedCandidate)
                    .match({share_code: session.user.user_metadata.share_code, user_id: session.user.id});
                    if(createdCandidatesError) return fail(402, {msg: createdCandidatesError.message});
                    else if(createdCandidates) return fail(200, {msg: "Successfully deleted a candidate", session, createdCandidates}); 
                }

            }else throw redirect(302, "/login?no-session");


        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            console.log(fieldErrors)
            return fail(403, {errors: fieldErrors});
        }
    }
};
