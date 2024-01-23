import { fail, type Actions } from "@sveltejs/kit";
import type { ZodError } from "zod";
import { joinCodeSchema } from "$lib/helpers/schemas/realVoterSchema";
import type { PostgrestError } from "@supabase/supabase-js";


export const actions: Actions = {
    
    joinCode: async ({request, locals: {supabase, getSession} }) => 
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = joinCodeSchema.parse(formData);

            const {data:checkCode, error:checkCodeError} = await supabase.rpc("check_if_code_exist", {input_value: result.shareCode}) as {data: boolean, error: PostgrestError | null};
            if(checkCodeError) return fail(402, {msg: checkCodeError.message});
            else if(checkCode){

                const {data: {user}, error:userError} = await supabase.auth.updateUser({
                    data: {
                        share_code: result.shareCode,
                    }
                });

                if(userError) return fail(402, {msg: userError.message});
                else if(user){
                    const candidateQuery = "id, created_at, candidate_name, candidate_organization, candidate_agenda, share_code, position_name";
                    const {data:createdCandidates, error:createdCandidatesError} = await supabase.from("created_candidate").select(candidateQuery).match({share_code: result.shareCode});
                    if(createdCandidatesError) return fail(402, {msg: createdCandidatesError.message});
                    else if(createdCandidates) return fail(200, {msg: "Successfully joined the voting chamber!.", createdCandidates});
                };

            }else return fail(402, {msg: "This code doesn't exist double check it."});
            
            
        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            console.log(fieldErrors)
            return fail(403, {errors: fieldErrors});
        };
    },
};