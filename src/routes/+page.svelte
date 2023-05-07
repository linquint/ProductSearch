<script lang="ts">
  import Icon from "@iconify/svelte"
  import Items from "../lib/Items.svelte";
  import type { PageData } from './$types';
  export let data: PageData;
  let query = '';
  let oldQuery = '';
  let timer;

  const submitSearch = () => {
    const currentQuery = query;
    if (oldQuery !== currentQuery) {
      fetch(`/api/search?q=${currentQuery}`).then(res => res.json()).then(json => {
        oldQuery = currentQuery;
        products = json;
      });
    }
  }

  const handleKeyUp = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      submitSearch();
    }, 300);
  }

  let products = data.products;
</script>

<svelte:head>
  <title>
    Product Search
  </title>
</svelte:head>

<form on:submit|preventDefault>
  <label class="search-input" for="searchQuery">
    <Icon icon="majesticons:search-line" class="icon" />
    <input
        id="searchQuery"
        name="query"
        type="text"
        placeholder="Search query"
        bind:value={query}
        on:keyup={handleKeyUp}
    >
  </label>
</form>

<Items data={products} />

<style lang="sass">
  .search-input
    display: flex
    flex-direction: row
    gap: 1rem
    border: 1px solid #333333
    padding: 0.5rem 1rem
    border-radius: 0.5rem
    font-size: 1.5rem
    align-items: center
  input[type="text"]
    border: none
    outline: none
    font-size: 1.25rem
    width: 100%
</style>