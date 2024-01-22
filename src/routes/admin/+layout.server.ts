import type { CreatedPositionTB } from "$lib/types";
import type { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { LayoutServerLoad } from "../$types";
import { redirect } from "@sveltejs/kit";


export const load: LayoutServerLoad = async ({locals: {supabase, getSession, supabaseAdmin}}) => 
{
    const {data, error} = await supabase.rpc("who_are_you") as {data: "Admin" | "Voter", error: PostgrestError | null};

    if(error){
        throw redirect(302, "/login?no-session");

    }else if(data === "Voter"){

        throw redirect(302, "/voter");

    }else if(data === "Admin"){

        const queryCreatedPosition = "id, created_at, position_name, vote_limit, share_code";
        const queryCreatedCandidate = "id, created_at, position_name, share_code, candidate_name, candidate_organization, candidate_agenda";

        const session = await getSession();

        const getPositions = async () => 
        {
            return await supabase.from("created_position").select(queryCreatedPosition).eq("user_id", session?.user.id) as PostgrestSingleResponse<CreatedPositionTB[]>;
        };

        const getCandidates = async () => 
        {
            return await supabase.from("created_candidate").select(queryCreatedCandidate)
            .match({share_code: session?.user.user_metadata.share_code, user_id: session?.user.id});
        };

        const getVoters = async () => 
        {
            const queryVoters = "id, created_at, user_id, user_email, username, share_code";
            return await supabase.from("user_list").select(queryVoters).match({share_code: session?.user.user_metadata.share_code, role_name: "Voter"});
        };

        return {
            positions: await getPositions(),
            candidates: await getCandidates(),
            createdVoters: await getVoters(),
        };

    }else throw redirect(302, "/login?no-session")

};