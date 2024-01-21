<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import type { Session } from "@supabase/supabase-js";
	import type { CreatedCandidateTB, ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { navState, candidateState } from "$lib";
	import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";

    export let candidate: CreatedCandidateTB;

    type DeleteCandidateNews = {
        session: Session
        msg: string
        createdCandidates: CreatedCandidateTB[]
    }
    
    let deleteCandidateLoader = false;
    let desktopDialog = false;
    let mobileDialog = false;

    const deleteCandidateNews: SubmitFunction = () => 
    {
        deleteCandidateLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, createdCandidates} } = result as ServerNews<DeleteCandidateNews>
                
            switch (status) {
                case 200:
                    toast.success("Success!", {description: msg});
                    $navState.session = session;
                    $candidateState.createdCandidates = createdCandidates;
                    deleteCandidateLoader = false;
                    desktopDialog = false;
                    mobileDialog = false;
                    break;
                
                case 402:
                    toast.error("Failed to delete candidate!", {description: msg});
                    deleteCandidateLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

    const candidateRef = candidate;

</script>


<div class="hidden md:block">
    <AlertDialog.Root bind:open={desktopDialog}>
        <AlertDialog.Trigger asChild let:builder>
            <Button builders={[builder]} variant="destructive">Delete</Button>
        </AlertDialog.Trigger>

        <AlertDialog.Content class="shadow-sm shadow-black dark:shadow-white">
            <AlertDialog.Header>
                <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                <AlertDialog.Description>
                    This action cannot be undone. This will permanently delete the candidate
                    and remove all its data from our database.
                </AlertDialog.Description>
            </AlertDialog.Header>

            <AlertDialog.Footer class="flex items-center">
                <AlertDialog.Cancel class="py-4">Cancel</AlertDialog.Cancel>

                <form method="POST" action="?/deleteCandidate" enctype="multipart/form-data" use:enhance={deleteCandidateNews}>
                    <input name="candidateRef" type="hidden" class="hidden" value={JSON.stringify(candidateRef)} />
                    <Button type="submit" variant="destructive" >
                        <MikeLoader name="Continue" loader={deleteCandidateLoader} loader_name="Deleting.."/>
                    </Button>
                </form>

            </AlertDialog.Footer>
        </AlertDialog.Content>

    </AlertDialog.Root>
</div>

<div class="md:hidden">
    <Drawer.Root bind:open={mobileDialog} >

        <Drawer.Trigger asChild let:builder>
            <Button builders={[builder]} variant="destructive">Delete</Button>
        </Drawer.Trigger>

        <Drawer.Content>

            <Drawer.Header class="text-left">
                <Drawer.Title>Are you absolutely sure?</Drawer.Title>
                <Drawer.Description>This action cannot be undone. This will permanently delete the candidate
                    and remove all its data from our database.</Drawer.Description>
            </Drawer.Header>

          
            <Drawer.Footer class="flex gap-2">
                <form method="POST" action="?/deleteCandidate" enctype="multipart/form-data" use:enhance={deleteCandidateNews} >
                    <input name="candidateRef" type="hidden" class="hidden" value={JSON.stringify(candidateRef)} />
                    <Button type="submit" variant="destructive" class="w-full">
                        <MikeLoader name="Continue" loader={deleteCandidateLoader} loader_name="Deleting.." />
                    </Button>  
                </form>

                <Drawer.Close asChild let:builder>
                    <Button variant="outline" builders={[builder]} class="border-slate-400 dark:border-slate-700">Cancel</Button>
                </Drawer.Close>
            </Drawer.Footer>
            
            

        </Drawer.Content>
    </Drawer.Root>
   
</div>
