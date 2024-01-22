import type { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import type { CreatedPositionTB } from "$lib/types";

export const load: LayoutServerLoad = async ({locals: {supabase, getSession}}) => {

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

        return {createdCandidates: await getCandidates(), session};

    }else if(data === "Admin"){

        throw redirect(302, "/admin/dashboard");

    }else throw redirect(302, "/login?no-session");
};