<script lang="ts">
	
    import * as Drawer from "$lib/components/ui/drawer";
    import { Button } from "$lib/components/ui/button";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
    import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";
	import type { CreatedCandidateTB, ServerNews } from "$lib/types";
	import { basicEncrypt } from "$lib/helpers/encryption";
	import { toast } from "svelte-sonner";
    import {voterState, navState} from "$lib";
    

    export let candidate: CreatedCandidateTB;

    let voteCandidateLoader = false;
    let desktopDialog = false;
    let mobileDialog = false;

    const castVoteNews: SubmitFunction = () => 
    {
        voteCandidateLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg} } = result as ServerNews<{msg: string}>;
                
            switch (status) {
                case 200:
                    toast.success("Success!", {description: msg});
                    voteCandidateLoader = false;
                    desktopDialog = false;
                    mobileDialog = false;
                    break;
            
                case 402:
                    toast.error("Failed to vote!", {description: msg});
                    voteCandidateLoader = false;
                    desktopDialog = false;
                    mobileDialog = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

    const candidateRef = basicEncrypt(JSON.stringify(candidate));
    $: sessionRef = basicEncrypt(JSON.stringify($navState.session));
    
</script>


<div class="hidden md:block">
    <AlertDialog.Root bind:open={desktopDialog}>
        <AlertDialog.Trigger asChild let:builder>
            <Button builders={[builder]}>Vote</Button>
        </AlertDialog.Trigger>

        <AlertDialog.Content class="shadow-sm shadow-black dark:shadow-white p-4">
            <AlertDialog.Header>
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                    You are about to vote <b class="underline">{candidate.candidate_name}</b> for the position of <b class="underline">{candidate.position_name}</b>.
                </AlertDialog.Description>
            </AlertDialog.Header>

            <AlertDialog.Footer class="flex items-center">
                <AlertDialog.Cancel class="py-4">Cancel</AlertDialog.Cancel>

                <form method="POST" action="?/castVote" enctype="multipart/form-data" use:enhance={castVoteNews}>
                    <input name="candidateRef" type="hidden" class="hidden" value={candidateRef} />
                    <input name="sessionRef" type="hidden" class="hidden" value={sessionRef} />
                    <Button type="submit" >
                        <MikeLoader name="Continue" loader={voteCandidateLoader} loader_name="Voting.."/>
                    </Button>
                </form>

            </AlertDialog.Footer>
        </AlertDialog.Content>

    </AlertDialog.Root>
</div>

<div class="md:hidden">
    <Drawer.Root bind:open={mobileDialog} >

        <Drawer.Trigger asChild let:builder>
            <Button builders={[builder]}>Vote</Button>
        </Drawer.Trigger>

        <Drawer.Content>

            <Drawer.Header class="text-left">
                <Drawer.Title>Are you absolutely sure?</Drawer.Title>
                <Drawer.Description>
                    You are about to vote <b class="underline">{candidate.candidate_name}</b> for the position of <b class="underline">{candidate.position_name}</b> 
                </Drawer.Description>
            </Drawer.Header>

            <Drawer.Footer class="flex gap-2">
                <form method="POST" action="?/castVote" enctype="multipart/form-data" use:enhance={castVoteNews} >
                    <input name="candidateRef" type="hidden" class="hidden" value={candidateRef} />
                    <input name="sessionRef" type="hidden" class="hidden" value={sessionRef} />
                    <Button type="submit"  class="w-full">
                        <MikeLoader name="Continue" loader={voteCandidateLoader} loader_name="Voting.." />
                    </Button>  
                </form>

                <Drawer.Close asChild let:builder>
                    <Button variant="outline" builders={[builder]} class="border-slate-400 dark:border-slate-700">Cancel</Button>
                </Drawer.Close>
            </Drawer.Footer>
            
            

        </Drawer.Content>
    </Drawer.Root>
   
</div>
