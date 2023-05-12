<script lang="ts">
  import Icon from "@iconify/svelte"
  import Items from "../lib/Items.svelte";
  import {
    appFilters,
    appliedFilters,
    brandFilter,
    brands,
    categories,
    categoryFilter,
    filtersLoaded,
    hasAppliedFilters,
    priceRange,
    productPage,
    products,
    productsList,
    productsLoaded,
    productStart,
    search,
    searchFilters,
    searchQuery,
    subcategories,
    subcategoryFilter
  } from "../store";
  import {onMount} from "svelte";
  import Filter from "$lib/Filter.svelte";
  let query = '';
  let timer;
  let priceMin = 0;
  let priceMax = 0;

  const submitSearch = async () => {
    const filter = $appFilters;
    if (query !== $search) {
      const searchResults = await fetch(`/api/products?start=0&q=${query}&brand=${filter.brandId}&category=${filter.categoryId}&subcategory=${filter.subcategoryId}&min=${filter.min}&max=${filter.max}`).then(res => res.json());
      searchQuery.set(query);
      productsList.set(searchResults);
    }
  }

  onMount(async () => {
    query = $search;

    if (!$productsLoaded) {
      const results = await fetch(`/api/products?start=${$productStart}`).then(res => res.json());
      productsList.set(results);
      productPage.set($productStart + 1);
    }
    if (!$filtersLoaded) {
      const filters = await fetch(`/api/filters`).then(res => res.json());
      searchFilters.set(filters.filters);
    }

    priceMin = $priceRange.min;
    priceMax = $priceRange.max;

    appliedFilters.subscribe(async (filter) => {
      const results = await fetch(`/api/products?start=0&q=${query}&brand=${filter.brandId}&category=${filter.categoryId}&subcategory=${filter.subcategoryId}&min=${filter.min}&max=${filter.max}`).then(res => res.json());
      productsList.set(results);
      productPage.set(0);
    });
  });

  const loadMoreProducts = async () => {
    const page = $productsList.length / 24;
    const filter = $appFilters;
    const results = await fetch(`/api/products?start=${page * 24}&q=${query}&brand=${filter.brandId}&category=${filter.categoryId}&subcategory=${filter.subcategoryId}&min=${filter.min}&max=${filter.max}`).then(res => res.json());
    productsList.set($products.concat(results));
  }

  const handlePriceFilter = () => {
    if (priceMin < $priceRange.min) {
      priceMin = $priceRange.min;
    }
    if (priceMax > $priceRange.max) {
      priceMax = $priceRange.max;
    }
    if (priceMin >= priceMax) {
      priceMin = parseFloat((priceMax - 0.01).toFixed(2));
    }
    const filters = $appliedFilters;
    filters.min = priceMin;
    filters.max = priceMax;
    clearTimeout(timer);
    timer = setTimeout(() => {
      appliedFilters.set(filters);
    }, 400);
  }

  const handleKeyUp = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      submitSearch();
    }, 400);
  }

  const resetFilter = () => {
    appliedFilters.set({
      brandId: undefined,
      categoryId: undefined,
      subcategoryId: undefined,
      min: undefined,
      max: undefined,
    });
    query = '';
    searchQuery.set('');
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
  <Filter data={$brands} filterType={0} selected={$brandFilter}>Filter by brand</Filter>
  <Filter data={$categories} filterType={1} selected={$categoryFilter}>Filter by category</Filter>
  <Filter data={$subcategories} filterType={2} selected={$subcategoryFilter}>Filter by subcategory</Filter>
  {#if $hasAppliedFilters}
    <button class="clear-filters" on:click={resetFilter}>
      <Icon icon="majesticons:delete-bin-line" class="reset-icon" />
    </button>
  {/if}
</div>

<div class="price-range" style="display: flex; flex-direction: column">
  <span>Price range</span>
  <div style="display: flex; flex-direction: row; gap: 1rem">
    <input type="number" bind:value={priceMin} on:keyup={handlePriceFilter}>
    <input type="number" bind:value={priceMax} on:keyup={handlePriceFilter}>
  </div>
</div>

{#if $productsLoaded}
  <Items />
{/if}

{#if $products.length % 24 === 0}
  <button class="load-more" type="button" on:click|preventDefault={loadMoreProducts}>Show more...</button>
{/if}

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
    font-size: 1.3rem
    width: 100%
  input[type="number"]
    border: 1px solid #555555
    outline: none
    font-size: 1.2rem
    width: 96px
    border-radius: 0.5rem
    padding: 0.5rem
  .filters
    display: flex
    flex-direction: row
    flex-wrap: wrap
    gap: 1rem
    margin-top: 1rem
  .load-more
    border: 0.2rem solid #333333
    padding: 0.8rem 2rem
    border-radius: 0.5rem
    background: transparent
    margin: 2rem auto 6rem
    display: block
    cursor: pointer
    font-size: 1.2rem
    transition: all .2s
    &:hover
      border: 0.2rem solid tomato
      color: tomato
  .price-range
    display: flex
    flex-direction: column
    margin-top: 1rem
    gap: 0.5rem
    span
      font-size: 1.2rem
      font-weight: bold
  .clear-filters
    border-radius: 0.5rem
    border: 1px solid #333333
    background: #ffffff
    font-size: 1.5rem
    height: 2rem
    width: 2rem
    cursor: pointer
    align-self: center
</style>