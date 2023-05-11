<div class="items-list">
  {#each $products as product}
    <a href={`/product/${product.id}`} class="item">
      <div>
        <img use:lazyLoad={product.imageUrl} alt={product.productName}>
        <span class="item-brand">{product["brand.name"]}</span>
        <span class="item-title">{product.productName}</span>
        <div class="item-prices">
          <span class={`item-price ${!(product.price === product.discountPrice) ? 'item-price-old' : ''}`}>
            €{product.price.toFixed(2)}
          </span>
          {#if !(product.price === product.discountPrice)}
            <span class="item-sale">€{product.discountPrice.toFixed(2)}</span>
          {/if}
        </div>
      </div>
    </a>
  {/each}
</div>

<script lang="ts">
  import { lazyLoad } from "$lib/functions/lazyLoad.js";
  import {products} from "../store";

  console.log($products)
</script>

<style lang="sass">
  .items-list
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(256px, 1fr))
    margin: 2rem 0
    gap: 2rem
  .item
    text-decoration: none
    padding: 1.5rem
    overflow: hidden
    border: 1px solid #ddd
    border-radius: 0.5rem
    max-width: 384px
    justify-content: flex-start
    & > div
      display: flex
      flex-direction: column
      gap: 0.5rem
      height: 100%
    &-title
      font-size: 1rem
      text-align: left
      display: block
    &-brand
      display: inline-block
      font-size: 1rem
      font-weight: bolder
      background: #555555
      color: #ffffff
      padding: 0.3rem 0.5rem
      border-radius: 0.5rem
      width: max-content
    &-prices
      display: flex
      flex-direction: row
      justify-content: flex-end
      gap: 1rem
      margin-top: auto
      align-self: flex-end
    &-price
      font-size: 1.5rem
      font-weight: bolder
      &-old
        font-size: 1rem
        text-decoration: line-through
    &-sale
      font-size: 1.5rem
      font-weight: bold
      color: tomato
    &:hover .item-title
      text-decoration: underline
</style>