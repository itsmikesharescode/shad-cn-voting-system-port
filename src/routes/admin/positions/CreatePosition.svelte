<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
	import type { SubmitFunction } from "@sveltejs/kit";
	import { enhance } from "$app/forms";
	import type { Session } from "@supabase/supabase-js";
	import type { ServerNews, CreatedPositionTB } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { navState, positionState } from "$lib";
	import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";

    type CreatePositionValidation = {
        position: string[];
        voteLimit: string[];
    };
    
    type CreatePositionNews = {
        session: Session
        msg: string
        createdPositions: CreatedPositionTB[]
        errors: CreatePositionValidation
    };

    let inputErrors: CreatePositionValidation | null = null;
    let createPositionLoader = false;
    let showDesktopDialog = false;
    let showMobileDialog = false;

    const createPositionNews: SubmitFunction = () => 
    {
        createPositionLoader = true;

        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, createdPositions, errors}} = result as ServerNews<CreatePositionNews>
                
            switch (status) {
                case 200:
                    $navState.session = session;
                    $positionState.createdPositions = createdPositions;
                    toast.success("Success!", {description: msg});
                    createPositionLoader = false;
                    showDesktopDialog = false;
                    showMobileDialog = false;
                    break;
                
                case 402:
                    
                    if(msg === `duplicate key value violates unique constraint "created_position_position_name_key"`){
                        toast.error("Failed to create position", {description: "Position name already exist try another one."});
                        createPositionLoader = false;
                        inputErrors = null;
                        break;
                    }

                    toast.error("Failed to create position!", {description: msg});
                    createPositionLoader = false;
                    inputErrors = null;
                    break;
                
                case 403:
                    inputErrors = errors;
                    createPositionLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

    
</script>


<div class="hidden md:block">
    <Dialog.Root bind:open={showDesktopDialog}>

        <Dialog.Trigger asChild let:builder>
            <Button builders={[builder]}>Create Position</Button>
        </Dialog.Trigger>
        
        <Dialog.Content class="sm:max-w-[425px] shadow-sm shadow-black dark:shadow-white">
        
            <Dialog.Header>
                <Dialog.Title>Create Position</Dialog.Title>
                <Dialog.Description>This will establish a position that voters can rely on.</Dialog.Description>
            </Dialog.Header>

            <form method="POST" action="?/createPosition" enctype="multipart/form-data" use:enhance={createPositionNews} class="flex flex-col gap-4">
                <Label for="position">Position:</Label>
                <Input name="position" type="text" id="position" class="border-slate-400 dark:border-slate-700" placeholder="Position name ex, Precedent"/>
                {#each inputErrors?.position ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}

                <Label for="voteLimit">Vote Limit:</Label>
                <Input name="voteLimit" type="number" id="voteLimit" class="border-slate-400 dark:border-slate-700" placeholder="Only accepts number"/>
                {#each inputErrors?.voteLimit ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}

                <Button type="submit">
                    <MikeLoader name="Create Position" loader={createPositionLoader} loader_name="Creating.." />
                </Button>
            </form>

        </Dialog.Content>

    </Dialog.Root>
</div>

<div class="md:hidden">
    <Drawer.Root bind:open={showMobileDialog} >

        <Drawer.Trigger asChild let:builder>
            <Button builders={[builder]}>Create Position</Button>
        </Drawer.Trigger>

        <Drawer.Content>

            <Drawer.Header class="text-left">
                <Drawer.Title>Create Position</Drawer.Title>
                <Drawer.Description>This will establish a position that voters can rely on.</Drawer.Description>
            </Drawer.Header>

            <form method="POST" action="?/createPosition" enctype="multipart/form-data" use:enhance={createPositionNews} class="">
                <div class="flex flex-col gap-4 p-4">
                    <Label for="position">Position:</Label>
                    <Input name="position" type="text" id="position" class="border-slate-400 dark:border-slate-700" placeholder="Position name ex, Precedent"/>
                    {#each inputErrors?.position ?? [] as err }
                        <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                    {/each}

                    <Label for="voteLimit">Vote Limit:</Label>
                    <Input name="voteLimit" type="number" id="voteLimit" class="border-slate-400 dark:border-slate-700" placeholder="Only accepts number"/>
                    {#each inputErrors?.voteLimit ?? [] as err }
                        <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                    {/each}

                </div>
            
            
                <Drawer.Footer class="">
                    <Button type="submit">
                        <MikeLoader name="Create Position" loader={createPositionLoader} loader_name="Creating.." />
                    </Button>

                    <Drawer.Close asChild let:builder>
                        <Button variant="outline" builders={[builder]} class="border-slate-400 dark:border-slate-700">Cancel</Button>
                    </Drawer.Close>
                </Drawer.Footer>
            </form>

        </Drawer.Content>
    </Drawer.Root>
</div>
