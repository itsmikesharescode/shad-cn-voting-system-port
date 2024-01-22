<script lang="ts">
	
    import * as Drawer from "$lib/components/ui/drawer";
    import { Button } from "$lib/components/ui/button";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
    import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";
	import type { CreatedVotersTB, ServerNews } from "$lib/types";
	import { basicEncrypt } from "$lib/helpers/encryption";
	import { toast } from "svelte-sonner";
    import {voterState} from "$lib";

    export let voter: CreatedVotersTB;

    type DeleteVoterNews = {
        msg: string
        createdVoters: CreatedVotersTB[]
    }

    let deleteVoterLoader = false;
    let desktopDialog = false;
    let mobileDialog = false;

    $: voterRef = basicEncrypt(JSON.stringify(voter));

    const deleteVoterNews: SubmitFunction = () => 
    {
        deleteVoterLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {msg, createdVoters} } = result as ServerNews<DeleteVoterNews>
                
            switch (status) {
                case 200:
                    $voterState.createdVoters = createdVoters;
                    toast.success("Success!", {description: msg});
                    deleteVoterLoader = false;
                    break;
                
                case 402:
                    toast.error("Failed to delete voter!", {description: msg});
                    deleteVoterLoader = false;
                    break;
                
            };
            await update();
        };
    };
    
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
                    This action cannot be undone. This will permanently delete the position
                    and remove all its data from our database.
                </AlertDialog.Description>
            </AlertDialog.Header>

            <AlertDialog.Footer class="flex items-center">
                <AlertDialog.Cancel class="py-4">Cancel</AlertDialog.Cancel>

                <form method="POST" action="?/deleteVoter" enctype="multipart/form-data" use:enhance={deleteVoterNews}>
                    <input name="voterRef" type="hidden" class="hidden" value={voterRef} />
                    <Button type="submit" variant="destructive" >
                        <MikeLoader name="Continue" loader={deleteVoterLoader} loader_name="Deleting.."/>
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
                <Drawer.Description>This action cannot be undone. This will permanently delete the position
                    and remove all its data from our database.</Drawer.Description>
            </Drawer.Header>

          
            <Drawer.Footer class="flex gap-2">
                <form method="POST" action="?/deletePosition" enctype="multipart/form-data" use:enhance={deleteVoterNews} >
                    <input name="voterRef" type="hidden" class="hidden" value={voterRef} />
                    <Button type="submit" variant="destructive" class="w-full">
                        <MikeLoader name="Continue" loader={deleteVoterLoader} loader_name="Deleting.." />
                    </Button>  
                </form>

                <Drawer.Close asChild let:builder>
                    <Button variant="outline" builders={[builder]} class="border-slate-400 dark:border-slate-700">Cancel</Button>
                </Drawer.Close>
            </Drawer.Footer>
            
            

        </Drawer.Content>
    </Drawer.Root>
   
</div>
