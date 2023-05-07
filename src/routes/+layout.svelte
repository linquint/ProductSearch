<script lang="ts">
  import Nav from "$lib/Nav.svelte";
</script>

<Nav />

<main>
  <slot />
</main>

<style lang="sass">
  main
    margin: 0 auto
    height: 100svh
    width: clamp(256px, 96%, 1280px)
</style>