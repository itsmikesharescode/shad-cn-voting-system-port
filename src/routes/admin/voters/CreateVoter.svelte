<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import type { Session } from "@supabase/supabase-js";
	import type { CreatedCandidateTB, ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { candidateState, navState, positionState } from "$lib";
	import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";
    import * as Select from "$lib/components/ui/select";

    

    let createVoterLoader = false;
    let showDesktopDialog = false;
    let showMobileDialog = false;

    const createVoterNews: SubmitFunction = () => 
    {
        return async ({ result, update }) => 
        {
            const {status, } = result
                
            switch (status) {
                case 200:
                    break;
                
                case 402:
                    break;
                
                case 403:
                    break;
                default:
                    break;
            };
            await update();
        };
    };

    
</script>


<Dialog.Root bind:open={showDesktopDialog}>

    <Dialog.Trigger asChild let:builder>
        <Button builders={[builder]}>Create a Voter</Button>
    </Dialog.Trigger>
    
    <Dialog.Content class="sm:max-w-[425px] shadow-sm shadow-black dark:shadow-white">
    
        <Dialog.Header>
            <Dialog.Title>Create New Voter</Dialog.Title>
            <Dialog.Description>This will create a voter account that will automatically join your voting chamber.</Dialog.Description>
        </Dialog.Header>

        <form method="POST" action="?/createCandidate" enctype="multipart/form-data" use:enhance={createVoterNews} class="flex flex-col gap-4">
            
            <Label for="username">Username:</Label>
            <Input name="username" type="text" id="username" class="border-slate-400 dark:border-slate-700" placeholder="Enter candidate name"/>
            
            <Label for="email">Email:</Label>
            <Input name="email" type="text" id="email" class="border-slate-400 dark:border-slate-700" placeholder="Enter candidate organization"/>

            <Label for="password">Password:</Label>
            <Input name="password" type="text" id="password" class="border-slate-400 dark:border-slate-700" placeholder="Enter candidate agenda"/>

            <Label for="confirmPass">Confirm Password:</Label>
            <Input name="confirmPass" type="text" id="confirmPass" class="border-slate-400 dark:border-slate-700" placeholder="Enter candidate agenda"/>

            <Button type="submit">
                <MikeLoader name="Create Voter" loader={createVoterLoader} loader_name="Creating.." />
            </Button>
        </form>

    </Dialog.Content>

</Dialog.Root>

