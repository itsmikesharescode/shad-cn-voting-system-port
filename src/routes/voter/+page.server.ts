import { fail, type Actions, redirect } from "@sveltejs/kit";
import type { ZodError } from "zod";
import { joinCodeSchema } from "$lib/helpers/schemas/realVoterSchema";
import type { PostgrestError, Session } from "@supabase/supabase-js";
import type { PageServerLoad } from "./$types";
import type { CreatedCandidateTB, SortedCandidates } from "$lib/types";
import { basicDecrypt } from "$lib/helpers/encryption";

export const load: PageServerLoad = async ({locals: {getSession, supabase}}) => {

    const {data, error} = await supabase.rpc("who_are_you") as {data: "Admin" | "Voter", error: PostgrestError | null};

    if(error){
        throw redirect(302, "/login?no-session");

    }else if(data === "Voter"){
        const session = await getSession();
            const candidateQuery = "id, created_at, candidate_name, candidate_organization, candidate_agenda, share_code, position_name, position_name";

        const getCandidates = async () =>
        {
            return await supabase.from("created_candidate").select(candidateQuery).match({share_code: session?.user.user_metadata.share_code});
        };

        const getPositions = async () =>
        {
            return await supabase.from("created_position").select("id, created_at, position_name, vote_limit, share_code").match({share_code: session?.user.user_metadata.share_code});
        };

        const sortCandidates = async () => 
        {
            const candidates = await getCandidates();
            const positions = await getPositions();

            let sortedCandidates: SortedCandidates[] = [];
            
            positions.data?.map(outerItem => {

                let tempArray: CreatedCandidateTB[] = [];

                candidates.data?.map(innerItem => {
                    outerItem.position_name === innerItem.position_name ? tempArray.push(innerItem) : null;
                });

                sortedCandidates.push({
                    position_name: outerItem.position_name,
                    vote_limit: outerItem.vote_limit,
                    candidates: tempArray,
                });
            });

            return sortedCandidates;
        };
        
        return {
            sortedCandidates: await sortCandidates(),
            session
        };

    }else if(data === "Admin"){

        throw redirect(302, "/admin/dashboard");

    }else throw redirect(302, "/login?no-session");

};

export const actions: Actions = {
    
    joinCode: async ({request, locals: {supabase} }) => 
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
                    const {error:insertError} = await supabase.from("user_list").update({share_code: result.shareCode}).match({user_id: user.id});
                    if(insertError) return fail(402, {msg: insertError.message});
                    else return fail(200, {msg: "Successfully joined the voting chamber!."});
                };

            }else return fail(402, {msg: "This code doesn't exist double check it."});
            
            
        } catch (error) {
            const zodError = error as ZodError;
            const {fieldErrors} = zodError.flatten();
            console.log(fieldErrors)
            return fail(403, {errors: fieldErrors});
        };
    },

    castVote: async ({request, locals: {supabase}}) => 
    {
        const formData = await request.formData();
        const candidateRef: CreatedCandidateTB = JSON.parse(basicDecrypt(formData.get("candidateRef") as string));
        const sessionRef: Session = JSON.parse(basicDecrypt(formData.get("sessionRef") as string));

        if(sessionRef){

            const {data: checkVoteLimit, error: checkVoteLimitError} = await supabase.from("created_position").select("vote_limit").match({position_name: candidateRef.position_name, share_code: candidateRef.share_code}) as {data: {vote_limit: number}[], error: PostgrestError | null};

            if(checkVoteLimitError) return fail(402, {msg: checkVoteLimitError.message});
            else if(checkVoteLimit){

                const voteLimit = checkVoteLimit[0].vote_limit;
                
                const {data: checkVoteCount, error: checkVoteCountError} = await supabase.from("voted_candidates").select("candidate_name").match({user_id: sessionRef.user.id, position_name: candidateRef.position_name, share_code: candidateRef.share_code}) as {data: {candidate_name: string}[], error: PostgrestError | null};
                
                if(checkVoteCountError) return fail(402, {msg: checkVoteCountError.message});
                else if(checkVoteCount){
                    
                    const lengthOfVotes = checkVoteCount.length;

                    if(voteLimit === lengthOfVotes) return fail(402, {msg: "You have reached the limit of votes for this position."});

                    else{

                        const isAlreadyVote = checkVoteCount.find(item => item.candidate_name === candidateRef.candidate_name);
                        
                        if(isAlreadyVote) return fail(402, {msg: "You have already voted for this candidate."});
                        else{
                            const { error:insertError } = await supabase.from("voted_candidates").insert([{
                                user_id: sessionRef.user.id,
                                position_name: candidateRef.position_name,
                                candidate_name: candidateRef.candidate_name,
                                candidate_organization: candidateRef.candidate_organization,
                                candidate_agenda: candidateRef.candidate_agenda,
                                share_code: candidateRef.share_code,
                            }]);

                            if(insertError) return fail(402, {msg: insertError.message});
                            else return fail(200, {msg: "Successfully voted!"});
                        };
                    };

                };
            };
            
        };
        
    }
};