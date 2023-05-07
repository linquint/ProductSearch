<script lang="ts">
    import {page} from "$app/stores";
</script>

<nav>
  <div class="nav-container">
    <div class="links">
      <span class="brand">Product Search</span>
      <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
    </div>
  </div>
</nav>

<style lang="sass">
  nav
    display: flex
    flex-direction: row
    padding: 1rem 0
    background: #ffffff
    position: sticky
    top: 0
    margin-bottom: 1rem
    z-index: 999
    border-bottom: 1px solid darkgrey
    *
      transition: all .2s
    a
      text-decoration: none
      font-size: 1.25rem
      width: fit-content
      font-weight: bolder
      padding: 0.5rem 1rem
      border-radius: 1rem
      &:hover
        background: #333333
        color: #ffffff
      &.active
        background: #333333
        color: #ffffff
    .links
      display: flex
      flex-direction: row
      gap: 1rem
      align-items: center
    .brand
      font-size: 1.5rem
      font-weight: bold
  .nav
    &-container
      display: flex
      flex-direction: row
      justify-content: space-between
      width: clamp(256px, 96%, 1280px)
      margin: 0 auto
</style>