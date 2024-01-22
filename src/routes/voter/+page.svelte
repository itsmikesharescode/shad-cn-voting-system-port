<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
</script>

<div class="flex flex-col gap-4 sm:max-w-xl mx-auto mt-[10dvh]">
    
    <form class="flex w-full max-w-sm items-center space-x-2 mx-auto">
        <Input type="email" placeholder="Enter voting code" class="border-slate-400 dark:border-slate-700" />
        <Button type="submit">Join</Button>
    </form>

    <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight text-center">You haven't joined any voting code. Join now!</h3>
</div>

