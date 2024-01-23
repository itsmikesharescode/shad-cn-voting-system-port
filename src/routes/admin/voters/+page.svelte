<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card";
	import CreateVoter from "./CreateVoter.svelte";
	import { onMount } from "svelte";
	import { navState, voterState } from "$lib";
	import { dateConvert } from "$lib/helpers/convertDate";
	import DeleteVoter from "./DeleteVoter.svelte";

    onMount( async () => {
        $navState.activeItem = "/admin/voters";
        
    })

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
                <Table.Head class="w-full">Email</Table.Head>
                <Table.Head class="w-full">Username</Table.Head>
                <Table.Head>Date Created</Table.Head>
                <Table.Head class="">Options</Table.Head>
            </Table.Row>
        </Table.Header>
    
        <Table.Body>
            {#each $voterState.createdVoters ?? [] as voter, index}
                <Table.Row>
                    <Table.Cell class="font-medium">{voter.user_email}</Table.Cell> 
                    <Table.Cell class="truncate">{voter.username}</Table.Cell>
                    <Table.Cell class="truncate">{dateConvert(voter.created_at)}</Table.Cell>
                    <Table.Cell class="flex gap-2 items-center">
                        
                        <DeleteVoter {voter} />
                       
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    
    </Table.Root>
</div>

<!--Mobile View-->
<div class=" max-h-[70dvh] overflow-auto md:hidden flex flex-wrap gap-4 justify-center">
    {#each $voterState.createdVoters ?? [] as voter, index}
        <Card.Root class="w-full sm:max-w-[45%] shadow-sm shadow-black dark:shadow-white">
            
            <Card.Header class="">
                <Card.Title class="text-2xl">{voter.user_email}</Card.Title>
                <Card.Description class="text-xs font-bold">Date Created: {voter.username}</Card.Description>
                <Card.Description class="text-xs font-bold">Position: {dateConvert(voter.created_at)}</Card.Description>
            </Card.Header>


            <Card.Footer class="flex justify-end gap-2 items-center">
                
               <DeleteVoter {voter} />

            </Card.Footer>

        </Card.Root>
    {/each}
</div>
