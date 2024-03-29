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

    type CreateCandidateValidation = {
        position: string[];
        candidateName: string[];
        organization: string[];
        agenda: string[];
    };
    
    type CreateCandidateNews = {
        session: Session
        msg: string
        createdCandidates: CreatedCandidateTB[]
        errors: CreateCandidateValidation
    };

    let inputErrors: CreateCandidateValidation | null = null;
    let createCandidateLoader = false;
    let showDesktopDialog = false;
    let showMobileDialog = false;

    const createCandidateNews: SubmitFunction = () => 
    {
        createCandidateLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, createdCandidates, errors} } = result as ServerNews<CreateCandidateNews>
                
            switch (status) {
                case 200:
                    toast.success("Success!", {description: msg});
                    $navState.session = session;
                    $candidateState.createdCandidates = createdCandidates;
                    createCandidateLoader = false;
                    showDesktopDialog = false;
                    showMobileDialog = false;
                    break;
                
                case 402:
                    toast.error("Failed to create candidate!", {description: msg});
                    inputErrors = null;
                    createCandidateLoader = false;
                    break;
                
                case 403:
                    inputErrors = errors;
                    createCandidateLoader = false;
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
        <Button builders={[builder]}>Create Candidate</Button>
    </Dialog.Trigger>
    
    <Dialog.Content class="sm:max-w-[425px] shadow-sm shadow-black dark:shadow-white">
    
        <Dialog.Header>
            <Dialog.Title>Create Candidate</Dialog.Title>
            <Dialog.Description>This will establish a candidate that voters can vote on.</Dialog.Description>
        </Dialog.Header>

        <form method="POST" action="?/createCandidate" enctype="multipart/form-data" use:enhance={createCandidateNews} class="flex flex-col gap-4">
            
            <Label for="position">Positions:</Label>
            <Select.Root portal={null}>

                <Select.Trigger class="border-slate-400 dark:border-slate-700">
                    <Select.Value placeholder="Select a position" />
                </Select.Trigger>

                <Select.Content class="border-slate-400 dark:border-slate-700 mt-2">

                    <Select.Group>
                        {#each $positionState.createdPositions ?? [] as position }
                            <Select.Item value={JSON.stringify(position)}>{position.position_name}</Select.Item>
                        {/each}
                    </Select.Group>

                </Select.Content>

                <Select.Input name="position" />

            </Select.Root>
            {#each inputErrors?.position ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}
            
            <Label for="candidateName">Candidate Name:</Label>
            <Input name="candidateName" type="text" id="candidateName" class="border-slate-400 dark:border-slate-700" placeholder="Enter candidate name"/>
            {#each inputErrors?.candidateName ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}
            
            <Label for="organization">Organization:</Label>
            <Input name="organization" type="text" id="organization" class="border-slate-400 dark:border-slate-700" placeholder="Enter candidate organization"/>
            {#each inputErrors?.organization ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}

            <Label for="agenda">Agenda:</Label>
            <Input name="agenda" type="text" id="agenda" class="border-slate-400 dark:border-slate-700" placeholder="Enter candidate agenda"/>
            {#each inputErrors?.agenda ?? [] as err }
                <p class="text-red-700 font-bold text-xs px-2">{err}</p>
            {/each}

            <Button type="submit">
                <MikeLoader name="Create Candidate" loader={createCandidateLoader} loader_name="Creating.." />
            </Button>
        </form>

    </Dialog.Content>

</Dialog.Root>

