<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import type { Session } from "@supabase/supabase-js";
	import type { CreatedCandidateTB, CreatedVotersTB, ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { candidateState, navState, positionState, voterState } from "$lib";
	import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";
    import * as Select from "$lib/components/ui/select";
	import { basicEncrypt } from "$lib/helpers/encryption";

    type CreatedVoterValidation = {
        shareCode: string[]
        username: string[]
        email: string[]
        password: string[]
        confirmPass: string[]
    };

    type CreateVoterNews = {
        session: Session
        msg: string
        createdVoters: CreatedVotersTB[]
        errors: CreatedVoterValidation
    };

    let inputErrors: CreatedVoterValidation | null = null;
    let createVoterLoader = false;
    let showDesktopDialog = false;
    let showMobileDialog = false;

    const createVoterNews: SubmitFunction = () => 
    {
        createVoterLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, errors, createdVoters} } = result as ServerNews<CreateVoterNews>;
                
            switch (status) {
                case 200:
                    $voterState.createdVoters = createdVoters;
                    toast.success("Success!", {description: msg});
                    createVoterLoader = false;
                    showDesktopDialog = false;
                    showMobileDialog = false;
                    break;
                
                case 402:
                    toast.error("Failed to create voter!", {description: msg});
                    createVoterLoader = false;
                    inputErrors = null;
                    break;
                
                case 403:
                    inputErrors = errors;
                    createVoterLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

    $: shareCode = basicEncrypt($navState.session?.user.user_metadata.share_code);
    
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

        <form method="POST" action="?/createVoter" enctype="multipart/form-data" use:enhance={createVoterNews} class="flex flex-col gap-4">
            
            <Label for="username">Username:</Label>
            <Input name="username" type="text" id="username" class="border-slate-400 dark:border-slate-700" placeholder="Enter username"/>
            {#each inputErrors?.username ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}


            <Label for="email">Email:</Label>
            <Input name="email" type="text" id="email" class="border-slate-400 dark:border-slate-700" placeholder="Enter email"/>
            {#each inputErrors?.email ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}

            <Label for="password">Password:</Label>
            <Input name="password" type="password" id="password" class="border-slate-400 dark:border-slate-700" placeholder="Enter password"/>
            {#each inputErrors?.password ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}

            <Label for="confirmPass">Confirm Password:</Label>
            <Input name="confirmPass" type="password" id="confirmPass" class="border-slate-400 dark:border-slate-700" placeholder="Confirm"/>
            {#each inputErrors?.confirmPass ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}

            <input name="shareCode" type="hidden" class="hidden" value={shareCode} />

            <Button type="submit">
                <MikeLoader name="Create Voter" loader={createVoterLoader} loader_name="Creating.." />
            </Button>
        </form>

    </Dialog.Content>

</Dialog.Root>

