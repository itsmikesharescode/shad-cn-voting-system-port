<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card";
	import CreatePosition from "./CreatePosition.svelte";
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
                <Table.Head >Vote Limit</Table.Head>
                <Table.Head>Date Created</Table.Head>
                <Table.Head class="">Options</Table.Head>
            </Table.Row>
        </Table.Header>
    
        <Table.Body>
            {#each ["","","","","","","","","","","","","","","","","","",] as invoice, i (i)}
                <Table.Row>
                    <Table.Cell class="font-medium">Precident</Table.Cell>
                    <Table.Cell class="text-center">1</Table.Cell>
                    <Table.Cell>Nov 6 1996</Table.Cell>
                    <Table.Cell class="flex gap-2 items-center">
                        <Button class="" variant="destructive">Delete</Button>
                        <Button class="" >Edit</Button>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    
    </Table.Root>
</div>

<!--Mobile View-->
<div class=" max-h-[70dvh] overflow-auto md:hidden flex flex-wrap gap-4 justify-center">
    {#each ["","","","","","","","","","","","","","","","","","",] as invoice, i (i)}
        <Card.Root class="w-full sm:max-w-[45%] shadow-sm shadow-black dark:shadow-white">
            
            <Card.Header class="">
                <Card.Title class="text-2xl">Precedent</Card.Title>
                <Card.Description class="text-xs font-bold"> Vote Limit: 1</Card.Description>
                <Card.Description class="text-xs font-bold"> Date Created: Nov 6 1996</Card.Description>
            </Card.Header>


            <Card.Footer class="flex justify-end gap-2 items-center">
                <Button class="" variant="destructive">Delete</Button>
                <Button class="" >Edit</Button>
            </Card.Footer>

        </Card.Root>
    {/each}
</div>
