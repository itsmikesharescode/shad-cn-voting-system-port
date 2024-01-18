<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import { Label } from "$lib/components/ui/label";
    import { Sun, Moon } from "lucide-svelte";
    import { toggleMode } from "mode-watcher";
    import {goto} from "$app/navigation";
	import { scale } from "svelte/transition";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Session } from "@supabase/supabase-js";
	import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";
	import type { ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { navState } from "$lib";

    type RegisterValidation = {
        role: string[]
        username: string[]
        email: string[]
        password: string[]
        confirmPass: string[]
    };

    type RegisterNews = {
        session: Session
        msg: string
        errors: RegisterValidation
        whoareyou: string
    };

    let inputErrors: RegisterValidation | null = null;
    let registerLoader = false;

    const registerNews: SubmitFunction = () => 
    {
        registerLoader = true;

        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, errors, whoareyou}} = result as ServerNews<RegisterNews>
                
            switch (status) {
                case 200:
                    $navState.session = session;
                    toast.success("Welcome!", {description: msg});
                    registerLoader = false;
                    if(whoareyou === "Admin") goto("/admin/dashboard");
                    else if(whoareyou === "Voter") goto("/voter");
                    break;
                
                case 402:
                    toast.error("Creation Failed", {description: msg});
                    registerLoader = false;
                    break;
                
                case 403:
                    inputErrors = errors;
                    registerLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };


</script>


<div class="min-h-screen flex justify-center items-center p-4" in:scale>
    <Card.Root class="w-full sm:max-w-[450px] shadow-sm shadow-black dark:shadow-white">
        
        <form method="POST" action="?/register" enctype="multipart/form-data" use:enhance={registerNews}>
            <Card.Header class="text-center">
                <Card.Title class="text-2xl">Register</Card.Title>
                <Card.Description class="text-xs font-bold">
                    Register to ICCT VOTING SYSTEM
                </Card.Description>
            </Card.Header>
        
            <Card.Content class="text-sm flex flex-col gap-4">
    
                <Label for="role">Role:</Label>
                
                <Select.Root portal={null}>
    
                    <Select.Trigger class="border-slate-400 dark:border-slate-700">
                        <Select.Value placeholder="Select a role" />
                    </Select.Trigger>
    
                    <Select.Content class="border-slate-400 dark:border-slate-700 mt-2">
    
                        <Select.Group>
                            <Select.Label>Role</Select.Label>
                            <Select.Item value="Voter">Voter</Select.Item>
                            <Select.Item value="Admin">Admin</Select.Item>
                        </Select.Group>
    
                    </Select.Content>
    
                    <Select.Input name="role" />
    
                </Select.Root>
                {#each inputErrors?.role ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}
                
                <Label for="username">Username:</Label>
                <Input name="username" type="text" id="username" placeholder="Enter your username." class="border-slate-400 dark:border-slate-700" />
                {#each inputErrors?.username ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}
    
                <Label for="email">Email:</Label>
                <Input name="email" type="email" id="email" placeholder="Enter your email." class="border-slate-400 dark:border-slate-700"/>
                {#each inputErrors?.email ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}
    
                <Label for="password">Password:</Label>
                <Input name="password" type="password" id="password" placeholder="Enter your password." class="border-slate-400 dark:border-slate-700"/>
                {#each inputErrors?.password ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}
    
                <Label for="confirmPass">Confirm Password:</Label>
                <Input name="confirmPass" type="password" id="password" placeholder="Confirm your password." class="border-slate-400 dark:border-slate-700"/>
                {#each inputErrors?.confirmPass ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}

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
                    
                <Button type="submit" title="Click, to proceed.">
                    <MikeLoader name="Create Account" loader={registerLoader} loader_name="Creating.." />
                </Button>
            </Card.Footer>
            
            <Card.Footer class="flex justify-between">
    
                <Button title="Click, to login your account." variant="link" 
                on:click={() => goto("/login")}
                >Log in here</Button>
    
            </Card.Footer>
        </form>

    </Card.Root>
</div>