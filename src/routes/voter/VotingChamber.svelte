<script lang="ts">
    import * as Table from "$lib/components/ui/table";
    import { Separator } from "$lib/components/ui/separator";
    import { realVoterState } from "$lib";
	import type { CreatedCandidateTB, FinalSort, SortedCandidates, VotedCandidatesTB } from "$lib/types";
	import { dateConvert } from "$lib/helpers/convertDate";
	import CastVote from "./CastVote.svelte";

    export let finalSort: FinalSort[];

</script>

<div class="mx-auto sm:max-w-[90%]">
    <div class="flex flex-col gap-2 justify-between"> 
        <h3 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Voting Chamber</h3>
    </div>
</div>
<Separator class="my-4 sm:max-w-[90%] mx-auto" />

{#each finalSort as sortedCandidate }

    {#if sortedCandidate.candidateAndVotes.length}

        <div class="mx-auto sm:max-w-[90%] overflow-auto  flex justify-between mt-[10dvh]">
            <h3 class="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">{sortedCandidate.position_name}</h3>
            <h3 class="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl">Max Vote: {sortedCandidate.vote_limit}</h3>
        </div>

        <div class="mx-auto max-h-[40dvh] sm:max-w-[90%] overflow-auto  md:block">
            <Table.Root class="mt-2">
                <Table.Header class="truncate">
                    <Table.Row>
                        <Table.Head class="w-full">Candidate Name</Table.Head>
                        <Table.Head class="w-full">Organization</Table.Head>
                        <Table.Head class="w-full">Total Votes</Table.Head>
                        <Table.Head>Date Added</Table.Head>
                        <Table.Head class="">Options</Table.Head>
                    </Table.Row>
                </Table.Header>

                <Table.Body> 
                    {#each sortedCandidate.candidateAndVotes as candidate, index}
                        <Table.Row>
                            <Table.Cell class="font-medium">{candidate.candidate_name}</Table.Cell> 
                            <Table.Cell class="truncate">{candidate.candidate_organization}</Table.Cell>
                            <Table.Cell class="truncate text-center">{candidate.total_votes}</Table.Cell>
                            <Table.Cell class="truncate">{dateConvert(candidate.created_at)}</Table.Cell>
                            <Table.Cell class="flex gap-2 items-center">
                                
                               <CastVote {candidate} />
                                
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>

            </Table.Root>

        </div>
    {/if}
    
{/each}
