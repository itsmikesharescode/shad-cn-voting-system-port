<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Sun, Moon } from "lucide-svelte";
    import { toggleMode } from "mode-watcher";
    import {goto} from "$app/navigation";
	import { scale } from "svelte/transition";
	import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { Session } from "@supabase/supabase-js";
	import type { ServerNews } from "$lib/types";
	import { navState } from "$lib";
	import MikeLoader from "$lib/components/mikeUI/MikeLoader.svelte";
    

    type LoginValidation = {
        email: string[]
        password: string[]
    };

    type LoginNews = {
        session: Session
        msg: string
        errors: LoginValidation
    };

    let inputErrors: LoginValidation | null = null;
    let loginLoader = false;

    const loginNews: SubmitFunction = () => 
    {
        loginLoader = true;
        return async ({ result, update }) => 
        {
            const {status, data: {session, msg, errors}} = result as ServerNews<LoginNews>
                
            switch (status) {
                case 200:
                    $navState.session = session;
                    toast.success("Welcome Back!", {description: msg});
                    loginLoader = false;
                    break;
                
                case 402:
                    toast.error(msg, {description: "Please check your email and password. Also your internet connection."});
                    loginLoader = false;
                    inputErrors = null;
                    break;
                
                case 403:
                    inputErrors = errors;
                    loginLoader = false;
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
        
        <form method="POST" action="?/login" enctype="multipart/form-data" use:enhance={loginNews}>
            <Card.Header class="text-center">
                <Card.Title class="text-2xl">Login</Card.Title>
                <Card.Description class="text-xs font-bold">
                    Login to ICCT VOTING SYSTEM
                </Card.Description>
            </Card.Header>
        
            <Card.Content class="text-sm flex flex-col gap-4">

                <Label for="email">Email:</Label>
                <Input name="email" type="email" id="email" placeholder="Enter your email." class="border-slate-400 dark:border-slate-700" />
                {#each inputErrors?.email ?? [] as err }
                    <p class="text-red-700 font-bold text-xs px-2">{err}</p>
                {/each}

                <Label for="password">Password:</Label>
                <Input name="password" type="password" id="password" placeholder="Enter your password." class="border-slate-400 dark:border-slate-700" />
                {#each inputErrors?.password ?? [] as err }
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
                    <MikeLoader name="Log in" loader={loginLoader} loader_name="Logging in.." />
                </Button>
            </Card.Footer>
            
            <Card.Footer class="flex justify-between">
    
                <Button title="Click, to recover your password via email." variant="link" 
                on:click={() => goto("/login?forgot")}
                >Forgot Password ?</Button>
    
                <Button title="Click, to create your account and start voting or creating vote system!" variant="link" 
                on:click={() => goto("/login?register")}
                >Create Account</Button>
    
            </Card.Footer>
        </form>

    </Card.Root>
</div>