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