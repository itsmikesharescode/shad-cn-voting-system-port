<script lang="ts">
	import { navState, realVoterState } from "$lib";
	import Nav from "$lib/components/mikeUI/Nav.svelte";
	import { onMount } from "svelte";
	import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;

    onMount( () => {
        $navState.defaultNav = $navState.voterNav;
        $navState.session = data.session;
        $realVoterState.createdCandidates = data.createdCandidates.data?.length ? data.createdCandidates.data : null; //force to be null inorder to regain reactivity
        $realVoterState.createdPositions = data.createdPositions.data?.length ? data.createdPositions.data : null; //force to be null inorder to regain reactivity
    });

</script>

<Nav />

<div class=" px-4 py-[14dvh]">
    <slot/>
</div>