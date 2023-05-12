<div class="dropdown" use:clickOutside={{ enabled: open, cb: () => dropdownOpen = false }}>
  <button type="button" class="dropdown-button" on:click={() => dropdownOpen = !dropdownOpen}>
    {#if !selected}
      <div>
        <slot />
      </div>
    {/if}
    {#if selected}
      <span>{data[selected - 1].name}</span>
    {/if}
  </button>
  <div class="dropdown-content" class:show={dropdownOpen}>
    {#each data as item}
      <button class="dropdown-item" on:click={() => selectFilter(item.id)}>
        <span>{item.name}</span>
      </button>
    {/each}
  </div>
</div>

<script lang="ts">
  import type {SearchFilter} from "$lib/server/db/types";
  import {appFilters, appliedFilters} from "../store";

  export let data: SearchFilter[] | undefined;
  export let selected: number | undefined;
  export let filterType: number;
  let dropdownOpen = false;

  function selectFilter(id: number) {
    dropdownOpen = false;
    const currentFilter = $appFilters;
    switch(filterType) {
      case 0: currentFilter.brandId = id; break;
      case 1: currentFilter.categoryId = id; break;
      case 2: currentFilter.subcategoryId = id; break;
    }
    appliedFilters.set(currentFilter);
  }

  function clickOutside(node, { enabled: initialEnabled, cb }) {
    const handleOutsideClick = ({ target }) => {
      if (!node.contains(target)) {
        cb();
      }
    };
    function update({enabled}) {
      if (enabled) {
        window.addEventListener('click', handleOutsideClick);
      } else {
        window.removeEventListener('click', handleOutsideClick);
      }
    }
    update({ enabled: initialEnabled });
    return {
      update,
      destroy() {
        window.removeEventListener( 'click', handleOutsideClick );
      }
    };
  }
</script>

<style lang="sass">
  .dropdown
    position: relative
    display: inline-block
    &-button
      outline: none
      background: transparent
      border: 1px solid #333333
      border-radius: 0.5rem
      padding: 0.75rem 0.5rem
      cursor: pointer
      width: 192px
      span:first-child
        text-align: left
        text-overflow: clip
        word-break: break-word
        width: 100%
    &-content
      display: none
      position: absolute
      background-color: #f6f6f6
      border: 1px solid #ddd
      z-index: 1
      border-radius: 0.5rem
      max-height: 70dvh
      overflow: auto
      scrollbar-width: thin
      width: 192px
    &-item
      border: none
      background: #f7f7f7
      padding: 0.75rem 0.5rem
      cursor: pointer
      display: flex
      flex-direction: row
      justify-content: space-between
      width: 100%
      &:hover
        background: #dddddd
      span:first-child
        text-align: left
        text-overflow: clip
        word-break: break-word
        align-self: center
  .show
    display: block
</style>