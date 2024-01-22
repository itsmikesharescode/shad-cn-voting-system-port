import { fail, redirect, type Actions } from "@sveltejs/kit";
import { createPositionSchema, deletePositionSchema } from "$lib/helpers/schemas/createPosition";
import type { ZodError } from "zod";
import type { PostgrestError } from "@supabase/supabase-js";

const queryCreatedPosition = "id, created_at, position_name, vote_limit, share_code";

export const actions: Actions = {

    createPosition: async ({request, locals: {supabase, getSession}}) =>
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = createPositionSchema.parse(formData);   

            const session = await getSession();

            if(session){
                const {data, error} = await supabase.rpc("check_if_position_exist", {input_value: result.position}) as {data: boolean, error: PostgrestError | null};

                if(data) return fail(402, {msg: "Position already exist."});
                else {
                    const {error: insertPositionError} = await supabase.from("created_position").insert([{
                        position_name: result.position,
                        vote_limit: Number(result.voteLimit),
                        user_id: session.user.id,
                        share_code: session.user.user_metadata.share_code,
                    }]);

                    if(insertPositionError) return fail(402, {msg: insertPositionError.message});
                    else {
                        const {data:createdPositions, error:createdPositionsError} = await supabase.from("created_position").select(queryCreatedPosition).eq("user_id", session.user.id);
                        if(createdPositionsError) return fail(402, {msg: createdPositionsError.message});
                        else if(createdPositions) return fail(200, {msg: "Position created successfully.", createdPositions, session});
                    };
                };

            }else throw redirect(302, "/login?no-session");

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        }
    },

    deletePosition: async ({request, locals: {supabase, getSession}}) =>
    {
        const formData = Object.fromEntries(await request.formData());
      
        try {
            const result = deletePositionSchema.parse(formData);
            const positionRef = JSON.parse(result.positionRef) as {id: number, share_code: string};
            const session = await getSession();

            if(session){

                const {error: deletePositionError} = await supabase.from("created_position").delete().match({id: positionRef.id, share_code: positionRef.share_code});
                if(deletePositionError) return fail(402, {msg: deletePositionError.message});
                else{
                    const {data: createdPositions, error: createdPositionsError} = await supabase.from("created_position").select(queryCreatedPosition).eq("user_id", session.user.id);
                    if(createdPositionsError) return fail(402, {msg: createdPositionsError.message});
                    else if(createdPositions) return fail(200, {msg: "Position deleted successfully.", createdPositions, session});
                };

            }else throw redirect(302, "/login?no-session")

            

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        }
    }
};