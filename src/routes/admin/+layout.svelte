<script lang="ts">
    import * as Menubar from "$lib/components/ui/menubar";
    import Nav from "$lib/components/mikeUI/Nav.svelte";
	import type { LayoutServerData } from "./$types";
	import { onMount } from "svelte";
	import { candidateState, navState, positionState, voterState } from "$lib";
	
    export let data: LayoutServerData;

    onMount( () => {
        $navState.defaultNav = $navState.adminNav;
        $positionState.createdPositions = data.positions.data;
        $candidateState.createdCandidates = data.candidates.data;
        $voterState.createdVoters = data.createdVoters.data;
    })

</script>

<Nav />

<div class=" px-4 py-[14dvh]">
    <slot/>
</div>
