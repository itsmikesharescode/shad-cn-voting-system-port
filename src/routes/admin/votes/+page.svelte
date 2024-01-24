<script lang="ts">
	import { onMount } from "svelte";
	import { navState } from "$lib";


    onMount( () => {
        $navState.activeItem = "/admin/votes";
    })

</script>

<div class="">
    <p class="text-center mt-[10dvh]">This votes is coming soon! for now your voting code is <b class="text-red-500">{$navState.session?.user.user_metadata.share_code}</b> you can share it to your voters or friends or you can make your friends a voter account in All voters tab.</p>

</div>