import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { ZodError } from "zod";

import { createVoterSchema, deleteVoterSchema } from "$lib/helpers/schemas/createVoter";
import type { CreatedVotersTB } from "$lib/types";
import { basicDecrypt } from "$lib/helpers/encryption";

export const actions: Actions = {

    createVoter: async ({request, locals: {supabaseAdmin}}) =>
    {
        
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = createVoterSchema.parse(formData);
            const shareCode = basicDecrypt(result.shareCode);
            
            if(result.confirmPass === result.password){
                const queryVoters = "id, created_at, user_id, user_email, username";
                const {data: {user}, error:createUserError} = await supabaseAdmin.auth.admin.createUser({
                    email: result.email,
                    password: result.password,
                    user_metadata: {
                        username: result.username,
                        share_code: shareCode,
                        role: "Voter",
                    },
                    email_confirm: true,
                });

                if(createUserError) return fail(402, {msg: createUserError.message});
                else if(user){

                    const {error:insertVoterError} = await supabaseAdmin.from("user_list").insert([{
                        user_id: user.id,
                        user_email: user.email,
                        username: user.user_metadata.username,
                        role_name: user.user_metadata.role,
                        share_code: user.user_metadata.share_code,
                    }]);

                    if(insertVoterError) return fail(402, {msg: insertVoterError.message});
                    else{
                        const {data:createdVoters, error:createdVotersErrors} = await supabaseAdmin.from("user_list").select(queryVoters).match({share_code: shareCode, role_name: "Voter"});

                        if(createdVotersErrors) return fail(402, {msg: createdVotersErrors.message});
                        else if(createdVoters) return fail(200, {msg: "Successfully created a voter.", createdVoters});
                    };
                };
                
            }else return fail(402, {msg: "Password does not match."});
            
        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors})
        }
    },

    deleteVoter: async ({request, locals: {supabase, supabaseAdmin, getSession}}) => 
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = deleteVoterSchema.parse(formData);
            const voterRef = JSON.parse( basicDecrypt(result.voterRef) ) as CreatedVotersTB;
            const {error:deleteVoterError} = await supabaseAdmin.auth.admin.deleteUser(voterRef.user_id);
            
            if(deleteVoterError) return fail(402, {msg: deleteVoterError.message});
            else{
                const {error:deleteUserListError} = await supabaseAdmin.from("user_list").delete().match({user_id: voterRef.user_id, user_email: voterRef.user_email});
                if(deleteUserListError) return fail(402, {msg: deleteUserListError.message});
                else {
                    const {data: createdVoters, error: createdVotersError} = await supabase.from("user_list").select("id, created_at, user_id, user_email, username").match({share_code: voterRef.share_code, role_name: "Voter"});
                    if(createdVotersError) return fail(402, {msg: createdVotersError.message});
                    else if(createdVoters) return fail(200, {msg: `Sucessfully deleted ${voterRef.username}`, createdVoters});
                
                }
            };
            
            
            

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            return fail(403, {errors: fieldErrors});
        }
    }
};
