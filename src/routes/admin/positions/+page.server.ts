import { fail, redirect, type Actions } from "@sveltejs/kit";
import { createPositionSchema } from "$lib/helpers/schemas/createPosition";
import type { ZodError } from "zod";

const queryCreatedPosition = "id, created_at, position_name, vote_limit, share_code"

export const actions: Actions = {
    createPosition: async ({request, locals: {supabase, getSession}}) =>
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = createPositionSchema.parse(formData);   

            const session = await getSession();

            if(session){

                const {error: insertPositionError} = await supabase.from("created_position").insert([{
                    position_name: result.position,
                    vote_limit: Number(result.voteLimit),
                    user_id: session.user.id,
                    share_code: session.user.user_metadata.share_code,
                }]);

                if(insertPositionError) return fail(402, {msg: insertPositionError.message});
                else {
                    const {data:createdPosition, error:createdPositionError} = await supabase.from("created_position").select(queryCreatedPosition).eq("user_id", session.user.id);
                    console.log(createdPosition);
                    if(createdPositionError) return fail(402, {msg: createdPositionError.message});
                    else if(createdPosition) return fail(200, {msg: "Position created successfully.", createdPosition, session});
                }

            }

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        }
    }
};