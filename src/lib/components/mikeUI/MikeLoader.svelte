<script lang="ts">
    export let name = "initial name";
    export let loader = false;
    export let loader_name = "loader name";

</script>

<div class="">
    {#if loader}
        <div class="flex items-center gap-2">
            <p>{loader_name}</p>
            <div class="loader"></div> 
        </div>
    {:else}
        <p>{name}</p>
    {/if}
</div>


<style>
.loader {
    width: 14px;
    aspect-ratio: 1;
    display: grid;
    border-radius: 50%;
    background:
        linear-gradient(0deg ,rgba(255, 255, 255, 0.993) 20%,#0000 0 70%,rgb(0 0 0/100%) 0) 50%/8% 100%,
        linear-gradient(90deg,rgb(0, 0, 0) 30%,#0000 0 70%,rgb(0 0 0/75% ) 0) 50%/100% 8%;
    background-repeat: no-repeat;
    animation: l23 0.4s infinite steps(12);
}
.loader::before,
.loader::after {
    content: "";
    grid-area: 1/1;
    border-radius: 50%;
    background: inherit;
    opacity: 0.915;
    transform: rotate(30deg);
}
.loader::after {
    opacity: 0.83;
    transform: rotate(60deg);
}
@keyframes l23 {
    100% {transform: rotate(1turn)}
}
</style>