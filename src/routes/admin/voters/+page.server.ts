import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { ZodError } from "zod";
import type { PageServerLoad } from "./$types";
import { createVoterSchema } from "$lib/helpers/schemas/createVoter";
import type { CreatedCandidateTB, CreatedPositionTB } from "$lib/types";

const queryCreatedPosition = "id, created_at, position_name, vote_limit, share_code";
const queryCreatedCandidate = "id, created_at, position_name, share_code, candidate_name, candidate_organization, candidate_agenda";

export const load: PageServerLoad = async ({locals: {supabase, getSession}}) => {

    const session = await getSession();

    if(session){
        

    }else throw redirect(302, "/login?no-session");

};


export const actions: Actions = {

    createVoter: async ({request, locals: {supabase, getSession}}) =>
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = createVoterSchema.parse(formData);
            
        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            console.log(fieldErrors)
            return fail(403, {errors: fieldErrors})
        }
    }
};
