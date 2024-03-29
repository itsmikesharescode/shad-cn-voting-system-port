<script lang="ts">
	import { enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
	import type { CreatedCandidateTB, ServerNews, SortedCandidates } from "$lib/types";
	import type { SubmitFunction } from "@sveltejs/kit";
    import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";
	import { toast } from "svelte-sonner";
	import { navState, realVoterState } from "$lib";
	import VotingChamber from "./VotingChamber.svelte";
	import { invalidateAll } from "$app/navigation";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";

    type JoinCodeValidation = {
        shareCode: string[]
    };

    type JoinCodeNews = {
        msg: string
        sortedCandidates: SortedCandidates[]
        errors: JoinCodeValidation
    };

    let inputErrors: JoinCodeValidation | null = null;
    let joinCodeLoader = false;

    const joinCodeNews: SubmitFunction = () => 
    {
        joinCodeLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg, sortedCandidates, errors} } = result as ServerNews<JoinCodeNews>;
                
            switch (status) {
                case 200:
                    toast.success("Successfully joined!", {description: msg});
                    joinCodeLoader = false;
                    invalidateAll();
                    break;
                
                case 402:
                    toast.error("Error joining!", {description: msg});
                    joinCodeLoader = false;
                    inputErrors = null;
                    break;
                
                case 403:
                    inputErrors = errors;
                    joinCodeLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

    export let data: PageServerData;

    onMount( () => {
        $navState.defaultNav = $navState.voterNav;
        $navState.session = data.session;
    });
 
    $: sortedCandidates = data.sortedCandidates;
    $: finalSort = data.finalSort;
    
</script>


{#if sortedCandidates.length }
    <VotingChamber {finalSort} />
{:else}
    <div class="flex flex-col gap-4 sm:max-w-xl mx-auto mt-[10dvh]">
        <form method="POST" action="?/joinCode" enctype="multipart/form-data" use:enhance={joinCodeNews} class="flex flex-col gap-2" >
            {#each inputErrors?.shareCode ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2 flex w-full max-w-sm items-center space-x-2 mx-auto">{err}</p>
            {/each}
            
            <div class="flex w-full max-w-sm items-center space-x-2 mx-auto">
                <Input name="shareCode" type="text" placeholder="Enter voting code" class="border-slate-400 dark:border-slate-700" />
                <Button type="submit">
                    <MikeLoader name="Join" loader={joinCodeLoader} loader_name="Joining.." />
                </Button>
            </div>
        </form>

        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">You haven't joined any voting code. Join now!</h3>
    </div>
{/if}


