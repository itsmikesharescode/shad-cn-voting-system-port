<script lang="ts">
	import { voterState } from "$lib";
    import * as Table from "$lib/components/ui/table";
    import { Separator } from "$lib/components/ui/separator";
    import { realVoterState } from "$lib";
	import { onMount } from "svelte";
	import type { CreatedCandidateTB, SortedCandidates } from "$lib/types";
    
    
    onMount( () => {

        let sortedCandites: SortedCandidates[] = [];

        $realVoterState.createdPositions?.map( outerItem => {

            let sortedCreatedCandidates: CreatedCandidateTB[] = [];

            $realVoterState.createdCandidates?.map(innerItem => {
                if(outerItem.position_name === innerItem.position_name){
                    sortedCreatedCandidates.push(innerItem)
                }
            });

            sortedCandites.push({
                position_name: outerItem.position_name,
                vote_limit: outerItem.vote_limit,
                candidates: sortedCreatedCandidates
            })
        });

        $realVoterState.sortedCandidates = sortedCandites;
    });


</script>

<div class="mx-auto sm:max-w-[90%]">
    <div class="flex flex-col gap-2 justify-between"> 
        <h3 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Voting Chamber</h3>
    </div>
</div>
<Separator class="my-4 sm:max-w-[90%] mx-auto" />

{#each $realVoterState.sortedCandidates ?? [] as sortedCandidate }

    {#if sortedCandidate.candidates.length}
        <div class="mx-auto max-h-[40dvh] sm:max-w-[90%] overflow-auto  md:block mt-[10dvh]">
            
            <div class="truncate w-full flex justify-between ">
                <h3 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">{sortedCandidate.position_name}</h3>
                <h3 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">Max Vote: {sortedCandidate.vote_limit}</h3>
                
            </div>

            <Table.Root class="mt-2">
                <Table.Header class="truncate">
                    <Table.Row>
                        <Table.Head class="w-full">Candidate Name</Table.Head>
                        <Table.Head class="w-full">Organization</Table.Head>
                        <Table.Head class="w-full">Total Votes</Table.Head>
                        <Table.Head>Date Created</Table.Head>
                        <Table.Head class="">Options</Table.Head>
                    </Table.Row>
                </Table.Header>

                <Table.Body> 
                    {#each sortedCandidate.candidates as candidate, index}
                        <Table.Row>
                            <Table.Cell class="font-medium">{candidate.candidate_name}</Table.Cell> 
                            <Table.Cell class="truncate">{candidate.candidate_organization}</Table.Cell>
                            <Table.Cell class="truncate text-center">0</Table.Cell>
                            <Table.Cell class="flex gap-2 items-center">
                                
                                <!-- <DeleteVoter {voter} /> -->
                                
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>

            </Table.Root>

        </div>
    {/if}
    
{/each}
