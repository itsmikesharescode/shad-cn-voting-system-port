<script lang="ts">
    import { page } from "$app/stores";
    import Login from "./Login.svelte";
    import Register from "./Register.svelte";
    import ForgotPass from "./ForgotPass.svelte";
	import { scale } from "svelte/transition";

</script>

<div class="" in:scale>
    {#if $page.url.search === "?register"}
    <Register />
    {:else if $page.url.search === "?forgot"}
        <ForgotPass />
    {:else}
        <Login />
    {/if}
</div>