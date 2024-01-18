<script lang="ts">
	import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Sun, Moon } from "lucide-svelte";
    import { toggleMode } from "mode-watcher";
  
  
</script>

<div class="min-h-screen flex justify-center items-center p-4">
    <Card.Root class="w-full sm:max-w-[40%] shadow-sm shadow-black dark:shadow-white">
        
        <Card.Header>
            <Card.Title>ICCT VOTING SYSTEM</Card.Title>
            <Card.Description>Leveraging modern technology, our system ensures a seamless voting experience that is significantly faster than traditional methods. </Card.Description>
        </Card.Header>
    
        <Card.Content class="text-sm flex flex-col gap-2">
            <p>
                Our system is built with a user-friendly interface, making it easy for voters of all ages to navigate and cast their votes. It also features robust security measures to protect the integrity of each vote, ensuring that every voice is heard and counted accurately.
            </p>

            <p>
                Join us as we revolutionize the voting process, making it more convenient and inclusive for everyone. Welcome to the future of voting!
            </p>
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
            <Button title="Click, to proceed." on:click={() => goto("/login")}>Let's Go</Button>
        </Card.Footer>
        
    </Card.Root>
</div>