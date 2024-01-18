<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Sun, Moon } from "lucide-svelte";
    import { toggleMode } from "mode-watcher";
    import {goto} from "$app/navigation";
	import { scale } from "svelte/transition";
</script>


<div class="min-h-screen flex justify-center items-center p-4" in:scale>
    <Card.Root class="w-full sm:max-w-[450px] shadow-sm shadow-black dark:shadow-white">
        
        <Card.Header class="text-center">
            <Card.Title class="text-2xl">Forgot Password</Card.Title>
            <Card.Description class="text-xs font-bold">
                Reset Password to ICCT VOTING SYSTEM
            </Card.Description>
        </Card.Header>
    
        <Card.Content class="text-sm flex flex-col gap-4">
            <Label for="email">Email:</Label>
            <Input name="email" type="email" id="email" placeholder="Enter your email." />

        </Card.Content>
    
        <Card.Footer class="flex justify-between">
            <Button on:click={toggleMode} variant="outline" size="icon">
                <Sun
                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
            <span class="sr-only">Toggle theme</span>
            </Button>
                
            <Button title="Click, to proceed.">Send Password Reset</Button>
        </Card.Footer>
        
        <Card.Footer class="flex justify-between">

            <Button title="Click, to recover your password via email." variant="link" 
            on:click={() => goto("/login")}
            >Log in here</Button>

        </Card.Footer>
    </Card.Root>
</div>