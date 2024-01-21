<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card";
	import CreateVoter from "./CreateVoter.svelte";
	import type { PageServerData } from "./$types";
	import { onMount } from "svelte";
	import { candidateState, navState, positionState } from "$lib";
	import { dateConvert } from "$lib/helpers/convertDate";
	import DeleteCandidate from "./DeleteCandidate.svelte";

    export let data: PageServerData;

    let {session, createdPosition, createdCandidates} = data;

    onMount( () => {
        $navState.activeItem = "/admin/voters";
        if(session) $navState.session = session, $positionState.createdPositions = createdPosition, $candidateState.createdCandidates = createdCandidates;
    });


</script>

<div class="mx-auto sm:max-w-[90%]">
    <div class="flex flex-col gap-2 justify-between"> 
        <h3 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Your System Voters</h3>

        <div class="flex gap-2 items-center">
            <CreateVoter />
            <Button class="">Search</Button>
        </div>

    </div>
</div>
<Separator class="my-4 sm:max-w-[90%] mx-auto" />

<!--Pc View-->
<div class="mx-auto max-h-[70dvh] sm:max-w-[90%] overflow-auto hidden md:block">
    <Table.Root class="">
        <Table.Header class="truncate">
            <Table.Row>
                <Table.Head class="w-full">Candidate Name</Table.Head>
                <Table.Head>Date Created</Table.Head>
                <Table.Head >Position</Table.Head>
                <Table.Head class="">Options</Table.Head>
            </Table.Row>
        </Table.Header>
    
        <Table.Body>
            {#each $candidateState.createdCandidates ?? [] as candidate, index}
                <Table.Row>
                    <Table.Cell class="font-medium">{candidate.candidate_name}</Table.Cell> 
                    <Table.Cell class="truncate">{dateConvert(candidate.created_at)}</Table.Cell>
                    <Table.Cell class="truncate">{candidate.position_name}</Table.Cell>
                    <Table.Cell class="flex gap-2 items-center">
                        
                        <DeleteCandidate {candidate} />
                       
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    
    </Table.Root>
</div>

<!--Mobile View-->
<div class=" max-h-[70dvh] overflow-auto md:hidden flex flex-wrap gap-4 justify-center">
    {#each $candidateState.createdCandidates ?? [] as candidate, index}
        <Card.Root class="w-full sm:max-w-[45%] shadow-sm shadow-black dark:shadow-white">
            
            <Card.Header class="">
                <Card.Title class="text-2xl">{candidate.candidate_name}</Card.Title>
                <Card.Description class="text-xs font-bold">Date Created: {dateConvert(candidate.created_at)}</Card.Description>
                <Card.Description class="text-xs font-bold">Position: {candidate.position_name}</Card.Description>
            </Card.Header>


            <Card.Footer class="flex justify-end gap-2 items-center">
                
                <DeleteCandidate {candidate}  />

            </Card.Footer>

        </Card.Root>
    {/each}
</div>
