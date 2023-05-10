<script lang="ts">
  import Icon from "@iconify/svelte"
  import Items from "../lib/Items.svelte";
  import {
    brandFilter,
    brands,
    categories,
    categoryFilter,
    filtersLoaded, productPage, products, productsList, productsLoaded, productStart,
    searchFilters,
    subcategories,
    subcategoryFilter
  } from "../store";
  import {onMount} from "svelte";
  import Filter from "$lib/Filter.svelte";
  let query = '';
  let oldQuery = '';
  let timer;

  const submitSearch = async () => {
    const currentQuery = query;
    if (oldQuery !== currentQuery) {
      const searchResults = await fetch(`/api/search?q=${currentQuery}`).then(res => res.json());
      oldQuery = currentQuery;
      productsList.set(searchResults);
    }
  }

  onMount(async () => {
    if (!$productsLoaded) {
      const results = await fetch(`/api/products?start=${$productStart}`).then(res => res.json());
      productsList.set(results);
      productPage.set($productStart + 1);
    }
    if (!$filtersLoaded) {
      const filters = await fetch(`/api/filters`).then(res => res.json());
      searchFilters.set(filters.filters);
    }
  });

  const loadMoreProducts = async () => {
    if (!query && query.length === 0) {
      const results = await fetch(`/api/products?start=${$productStart}`).then(res => res.json());
      productsList.set($products.concat(results));
      productPage.set($productStart + 1);
    }
  }

  const handleKeyUp = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      submitSearch();
    }, 300);
  }
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

<div class="filters">
  <Filter data={$brands} selected={$brandFilter}>Filter by brand</Filter>
  <Filter data={$categories} selected={$categoryFilter}>Filter by category</Filter>
  <Filter data={$subcategories} selected={$subcategoryFilter}>Filter by subcategory</Filter>
</div>

{#if $productsLoaded}
  <Items data={$products} />
{/if}

<button style="padding-bottom: 20rem" type="button" on:click|preventDefault={loadMoreProducts}>Show more...</button>

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
  .filters
    display: flex
    flex-direction: row
    gap: 1rem
    margin-top: 1rem
</style>