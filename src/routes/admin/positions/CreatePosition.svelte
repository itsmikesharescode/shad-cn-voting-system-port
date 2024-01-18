<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    
    
</script>


    <div class="hidden md:block">
        <Dialog.Root>
            <Dialog.Trigger asChild let:builder>
                <Button builders={[builder]}>Create Position</Button>
            </Dialog.Trigger>
            <Dialog.Content class="sm:max-w-[425px] shadow-sm shadow-black dark:shadow-white">
            <Dialog.Header>
                <Dialog.Title>Edit profile</Dialog.Title>
                <Dialog.Description>
                Make changes to your profile here. Click save when you're done.
                </Dialog.Description>
            </Dialog.Header>
            <form class="grid items-start gap-4">
                <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input type="email" id="email" value="shadcn@example.com" class="border-slate-400 dark:border-slate-700"/>
                </div>
                <div class="grid gap-2">
                <Label for="username">Username</Label>
                <Input id="username" value="@shadcn" class="border-slate-400 dark:border-slate-700"/>
                </div>
                <Button type="submit">Save changes</Button>
            </form>
            </Dialog.Content>
        </Dialog.Root>
    </div>

    <div class="md:hidden">
        <Drawer.Root >
            <Drawer.Trigger asChild let:builder>
            <Button builders={[builder]}>Create Position</Button>
            </Drawer.Trigger>
            <Drawer.Content>
            <Drawer.Header class="text-left">
                <Drawer.Title>Edit profile</Drawer.Title>
                <Drawer.Description>
                Make changes to your profile here. Click save when you're done.
                </Drawer.Description>
            </Drawer.Header>
            <form class="grid items-start gap-4 px-4">
                <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input type="email" id="email" value="shadcn@example.com" class="border-slate-400 dark:border-slate-700"/>
                </div>
                <div class="grid gap-2">
                <Label for="username">Username</Label>
                <Input id="username" value="@shadcn" class="border-slate-400 dark:border-slate-700"/>
                </div>
                <Button type="submit">Save changes</Button>
            </form>
            <Drawer.Footer class="pt-2">
                <Drawer.Close asChild let:builder>
                <Button variant="outline" builders={[builder]}>Cancel</Button>
                </Drawer.Close>
            </Drawer.Footer>
            </Drawer.Content>
        </Drawer.Root>
    </div>
