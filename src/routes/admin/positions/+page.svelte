<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card";
	import CreatePosition from "./CreatePosition.svelte";
	import type { PageServerData } from "./$types";
	import { onMount } from "svelte";
	import { navState, positionState } from "$lib";
	import { dateConvert } from "$lib/helpers/convertDate";
	import DeletePosition from "./DeletePosition.svelte";

    export let data: PageServerData;

    let {session, createdPosition} = data;

    onMount( () => {
        if(session) $navState.session = session, $positionState.createdPositions = createdPosition;
    });


</script>

<div class="mx-auto">
    <div class="flex flex-col gap-2 justify-between"> 
        <h3 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Positions</h3>

        <div class="flex gap-2 items-center">
            <CreatePosition />
            <Button class="">Search</Button>
        </div>

    </div>
</div>
<Separator class="my-4" />

<!--Pc View-->
<div class="mx-auto max-h-[70dvh] overflow-auto hidden md:block">
    <Table.Root class="">
        <Table.Header class="truncate">
            <Table.Row>
                <Table.Head class="w-full">Position</Table.Head>
                <Table.Head>Date Created</Table.Head>
                <Table.Head >Vote Limit</Table.Head>
                <Table.Head class="">Options</Table.Head>
            </Table.Row>
        </Table.Header>
    
        <Table.Body>
            {#each $positionState.createdPositions ?? [] as position, index}
                <Table.Row>
                    <Table.Cell class="font-medium">{position.position_name}</Table.Cell> 
                    <Table.Cell class="truncate">{dateConvert(position.created_at)}</Table.Cell>
                    <Table.Cell class="text-center">{position.vote_limit}</Table.Cell>
                    <Table.Cell class="flex gap-2 items-center">
                        
                        <DeletePosition {position} />
                       
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    
    </Table.Root>
</div>

<!--Mobile View-->
<div class=" max-h-[70dvh] overflow-auto md:hidden flex flex-wrap gap-4 justify-center">
    {#each $positionState.createdPositions ?? [] as position, index}
        <Card.Root class="w-full sm:max-w-[45%] shadow-sm shadow-black dark:shadow-white">
            
            <Card.Header class="">
                <Card.Title class="text-2xl">{position.position_name}</Card.Title>
                <Card.Description class="text-xs font-bold"> Vote Limit: {position.vote_limit}</Card.Description>
                <Card.Description class="text-xs font-bold"> Date Created: {dateConvert(position.created_at)}</Card.Description>
            </Card.Header>


            <Card.Footer class="flex justify-end gap-2 items-center">
                
                <DeletePosition {position}  />

            </Card.Footer>

        </Card.Root>
    {/each}
</div>
