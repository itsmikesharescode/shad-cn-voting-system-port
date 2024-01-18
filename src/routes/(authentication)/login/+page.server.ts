import { fail, type Actions } from "@sveltejs/kit";
import { loginSchema, registerSchema, resetPassSchema } from "$lib/helpers/schemas/login";
import {ZodError, z} from "zod";
import { generateCode } from "$lib/helpers/generateCode";


export const actions: Actions = {

    login: async ({request, locals: {supabase}}) => 
    {
        const formData = Object.fromEntries(await request.formData());

        try {
            const result = loginSchema.parse(formData);

            const {data: {session}, error:loginError} = await supabase.auth.signInWithPassword({email: result.email, password: result.password});
            if(loginError) return fail(402, {msg: loginError.message});
            else if(session) return fail(200, {msg: "Logged in successfully.", session});


        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();

            return fail(403, {errors: fieldErrors});
        }
    },

    register: async ({request, locals: {supabase}}) =>
    {
        const formData = Object.fromEntries(await request.formData());
        
        
        try {
            const result = registerSchema.parse(formData);

            if(result.confirmPass === result.password){

                const {data:{session}, error:registerError} = await supabase.auth.signUp({
                    email: result.email,
                    password: result.password,
                    options: {
                        data: {
                            username: result.username,
                            role: result.role
                        }
                    }
                });

                if(registerError) return fail(402, {msg: registerError.message});

                else if(session){
                    
                    if(result.role === "Admin"){
                        const share_code = generateCode(12);

                        const {error:insertAdminError} = await supabase.from("user_list").insert([{
                            user_id: session.user.id,
                            user_email: session.user.email,
                            role_name: session.user.user_metadata.role,
                            username: session.user.user_metadata.username,
                            share_code,
                        }]);
                        console.log(insertAdminError?.message)
                        if(insertAdminError) return fail(402, {msg: insertAdminError.message});
                        else return fail(200, {msg: "Registered successfully.", session, whoareyou: "Admin"});

                    }else if(result.role === "Voter"){
                        const {error:insertVoterError} = await supabase.from("user_list").insert([{
                            user_id: session.user.id,
                            user_email: session.user.email,
                            role_name: session.user.user_metadata.role,
                            username: session.user.user_metadata.username,
                        }]);

                        if(insertVoterError) return fail(402, {msg: insertVoterError.message});
                        else return fail(200, {msg: "Registered successfully.", session, whoareyou: "Voter"});
                    }
                }
                
            }else return fail(402, {msg: "Password and confirm password must match."});

           

        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();

            return fail(403, {errors: fieldErrors});
        }
    }

};