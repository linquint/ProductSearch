<div class="dropdown" use:clickOutside={{ enabled: open, cb: () => dropdownOpen = false }}>
  <button type="button" class="dropdown-button" on:click={() => dropdownOpen = !dropdownOpen}>
    {#if !selected}
      <div>
        <slot />
      </div>
    {/if}
    {#if selected}
      <span>{data[selected].title}</span>
      <span>{data[selected].count}</span>
    {/if}
  </button>
  <div class="dropdown-content" class:show={dropdownOpen}>
    {#each data as item, index}
      <div class="dropdown-item">
        <span>{item.title}</span>
        <span>{item.count}</span>
      </div>
    {/each}
  </div>
</div>

<script lang="ts">
  import type {SearchFilter} from "$lib/server/db/types";

  export let data: SearchFilter[] | undefined;
  export let selected: number | undefined;
  let dropdownOpen = false;

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

<!--<div class="dropdown">-->
<!--  <button onclick="myFunction()" class="dropbtn">Dropdown</button>-->
<!--  <div id="myDropdown" class="dropdown-content">-->
<!--    <input type="text" placeholder="Search.." id="myInput" onkeyup="filterFunction()">-->
<!--    <a href="#about">About</a>-->
<!--    <a href="#base">Base</a>-->
<!--    <a href="#blog">Blog</a>-->
<!--    <a href="#contact">Contact</a>-->
<!--    <a href="#custom">Custom</a>-->
<!--    <a href="#support">Support</a>-->
<!--    <a href="#tools">Tools</a>-->
<!--  </div>-->
<!--</div>-->

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
      gap: 1rem
      display: flex
      flex-direction: row
      cursor: pointer
      span:first-child
        text-align: left
        text-overflow: clip
        word-break: break-word
        width: 144px
      span:nth-child(2)
        text-align: right
        font-weight: bold
        width: 64px
      div
        width: calc(144px + 64px + 1rem)
    &-content
      display: none
      position: absolute
      background-color: #f6f6f6
      border: 1px solid #ddd
      z-index: 1
      border-radius: 0.5rem
      max-height: 70dvh
      overflow: auto
    &-item
      padding: 0.75rem 0.5rem
      cursor: pointer
      display: flex
      flex-direction: row
      justify-content: space-between
      &:hover
        background: #dddddd
        scrollbar-width: thin
      span:first-child
        text-align: left
        text-overflow: clip
        word-break: break-word
        width: 144px
        align-self: center
      span:nth-child(2)
        text-align: right
        font-weight: bold
        width: 64px
        align-self: center
  .show
    display: block
</style>