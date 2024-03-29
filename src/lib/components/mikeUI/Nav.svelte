<script lang="ts">
    import { navState } from "$lib";
	import { fly, scale } from "svelte/transition";
	import Button from "../ui/button/button.svelte";
    import { Sun, Moon } from "lucide-svelte";
    import { toggleMode } from "mode-watcher";
	import MikeLoader from "./MikeLoader.svelte";
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { ServerNews } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

    let showMobileMenu = false;
    let signOutLoader = false;

    const signOutNews: SubmitFunction = () => 
    {
        signOutLoader = true;

        return async ({ result, update }) => 
        {
            const {status, data: {msg}} = result as ServerNews<{msg: string}>
                
            switch (status) {
                case 200:
                    toast.success("Goodbye!", {description: msg});
                    $navState.session = null;
                    goto("/login?thankYou=Goodbye!");
                    signOutLoader = false;
                    break;
                
                case 402:
                    toast.error("Failed to log out!", {description: msg});
                    signOutLoader = false;
                    break;

                default:
                    break;
            };
            await update();
        };
    };

    $: hasVoter = $navState.session?.user.user_metadata.role as "Voter" | "Admin";

</script>

<div class="fixed backdrop-blur-lg p-2 border-b-2 w-full flex items-center justify-between border-black dark:border-slate-400">
    <Button variant="ghost" class="flex flex-col gap-1 items-start md:hidden {hasVoter === "Voter" ? "hidden" : ""}" on:click={() => showMobileMenu = true}> 
        <div class="w-4 border-b-2 dark:border-white border-black"></div>
        <div class="w-6 border-b-2 dark:border-white border-black"></div>
        <div class="w-4 border-b-2 dark:border-white border-black"></div>
    </Button>

    <div class="flex md:w-full md:justify-between">

        <div class="hidden md:flex gap-2 truncate">
            {#each $navState.defaultNav as navigation }
                {#each navigation.items as item }
                    <a href={item.url} 
                    class="p-2 hover:bg-slate-700 transition-all rounded-lg hover:text-white {$navState.activeItem === item.url ? "bg-[#000000b7] text-white dark:bg-[#ffffff4b]" : ""}"
                    on:click={() => {
                        $navState.activeItem = item.url;
                        showMobileMenu = false;
                    }}
                    >{item.title}</a>
                {/each}
            {/each}
        </div>
    
    
        <div class="flex items-center gap-3 truncate ">
    
            <div class="items-center gap-2 flex {hasVoter === "Admin" ? "hidden sm:flex" : ""} ">
                <p>Hello,</p>
                {$navState.session?.user?.email}
            </div>
    
            <form method="POST" action="/login?/signOut" use:enhance={signOutNews}>
                <Button type="submit" variant="destructive">
                    <MikeLoader name="Log out" loader={signOutLoader} loader_name="Logging out.."  />
                </Button>
            </form>
        
            <Button on:click={toggleMode} variant="outline" size="icon">
                <Sun
                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </div>
    </div>

</div>

{#if showMobileMenu}
    <div class="fixed left-0 top-0 right-0 bottom-0 bg-[#00000075] md:hidden {hasVoter === "Voter" ? "hidden" : ""}">
        <div class="fixed left-0 top-0 w-[70%] sm:w-[40%] md:w-[30%] lg:w-[20%]  bottom-0 bg-white dark:bg-black" in:fly={{x:-200, duration: 350}} out:fly={{x:-200, duration:100}}>
            <div class="flex justify-end mb-10 p-2">
                <Button variant="ghost" class="flex flex-col gap-1 items-end" on:click={() => showMobileMenu = false}> 
                    <div class="w-4 border-b-2 dark:border-white border-black"></div>
                    <div class="w-6 border-b-2 dark:border-white border-black"></div>
                    <div class="w-4 border-b-2 dark:border-white border-black"></div>
                </Button>
        </div>

            {#each $navState.defaultNav as navigation }

                <div class="font-bold border-b-2 p-2">{navigation.category}</div>

                <div class="flex flex-col gap-2 p-4">

                    {#each navigation.items as item }
                        <a href={item.url} 
                        class="p-2 hover:bg-slate-700 hover:text-white {$navState.activeItem === item.url ? "bg-[#000000b7] text-white dark:bg-[#ffffff4b]" : ""}"
                        on:click={() => {
                            $navState.activeItem = item.url;
                            showMobileMenu = false;
                        }}
                        >{item.title}</a>
                    {/each}

                </div>
            {/each}

            
        </div>
    </div>
{/if}



