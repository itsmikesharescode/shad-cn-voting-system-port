<script lang="ts">
    import "../app.pcss";
    import { Toaster } from "$lib/components/ui/sonner";
	import type { LayoutServerData } from "./$types";
	import { onMount } from "svelte";
	import { navState } from "$lib";
	
    export let data: LayoutServerData;

    onMount( () => {
        $navState.session = data.session;

    })

</script>

<Toaster richColors={true} />

<slot/>

<div class=" text-center p-4 text-sm">
    <p>Created from scratch by 
        <a  
        title="Click, to visit my YouTube channel."
        href="https://www.youtube.com/@mikeSharesCode" target="_blank" 
        class="text-red-700 dark:text-red-500 transition-all hover:underline">@mikeSharesCode
        </a>
    </p>
</div>