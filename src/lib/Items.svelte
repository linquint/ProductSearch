<div class="items-list">
  {#each data as product}
    <a href={`/product/${product.id}`} class="item">
      <div>
        <img src={product.Image_Url} alt={product.ProductName}>
        <span class="item-brand">{product.Brand}</span>
        <span class="item-title">{product.ProductName}</span>
        <div class="item-prices">
          <span class={`item-price ${!(product.Price === product.DiscountPrice) ? 'item-price-old' : ''}`}>
            €{(product.Price * 0.011).toFixed(2)}
          </span>
          {#if !(product.Price === product.DiscountPrice)}
            <span class="item-sale">€{(product.DiscountPrice * 0.011).toFixed(2)}</span>
          {/if}
        </div>
      </div>
    </a>
  {/each}
</div>

<script lang="ts">
  export let data;
</script>

<style lang="sass">
  .items-list
    display: grid
    grid-template-columns: repeat(auto-fit, minmax(256px, 1fr))
    margin: 2rem 0
    border: 1px solid #ddd
    border-radius: 1rem
    overflow: hidden
  .item
    text-decoration: none
    padding: 1.5rem
    overflow: hidden
    border: 1px solid #ddd
    max-width: 384px
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