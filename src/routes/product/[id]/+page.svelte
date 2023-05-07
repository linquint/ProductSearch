<script lang="ts">
  import type {PageData} from './$types';
  export let data: PageData;
</script>

<svelte:head>
  <title>
    {data.product.ProductName}
  </title>
</svelte:head>

<div class="item-details">
  {#if data.product}
    <div class="categories">
      <a href="/">Products</a>
      <span>>></span>
      <a href={`/?category=${data.product.Category}`}>{data.product.Category}</a>
      {#if data.product.SubCategory}
        <span>>></span>
        <a href={`/?subcategory=${data.product.SubCategory}`}>{data.product.SubCategory}</a>
      {/if}
    </div>
    <div class="item-details-row">
      <img src={data.product.Image_Url} alt={data.product.ProductName}>
      <div>
        <span class="item-brand">{data.product.Brand}</span>
        <span class="item-title">{data.product.ProductName}</span>

        <div class="item-details-prices">
          <span class={`item-details-price ${!(data.product.Price === data.product.DiscountPrice) ? 'item-details-price-old' : ''}`}>
            €{(data.product.Price * 0.011).toFixed(2)}
          </span>
          {#if !(data.product.Price === data.product.DiscountPrice)}
            <span class="item-details-sale">€{(data.product.DiscountPrice * 0.011).toFixed(2)}</span>
          {/if}
        </div>

        <span class="item-details-quantity">Quantity: <strong>{data.product.Quantity}</strong></span>
      </div>
    </div>
  {/if}
  {#if !data.product}
    <h3>Item not found!</h3>
  {/if}
</div>

<style lang="sass">
  .categories
    display: flex
    flex-direction: row
    gap: 0.5rem
    margin-bottom: 2rem
    flex-wrap: wrap
    a:hover
      color: tomato
  .item
    &-details
      display: flex
      flex-direction: column
      gap: 1rem
      &-row
        display: flex
        flex-direction: row
        gap: 2rem
        @media(max-width: 512px)
          flex-direction: column
        img
          width: clamp(160px, 100%, 512px)
          border-radius: 1rem
          border: 1px solid #bbbbbb
        & > div
          display: flex
          flex-direction: column
          gap: 1rem
      &-prices
        display: flex
        flex-direction: row
        gap: 1rem
        align-items: center
      &-price
        font-size: 2rem
        font-weight: bolder
        &-old
          font-size: 1.4rem
          text-decoration: line-through
      &-sale
        font-size: 2rem
        font-weight: bold
        color: tomato
      &-quantity
        font-size: 1.25rem
    &-brand
      font-size: 1.2rem
      background: #333333
      border-radius: 0.5rem
      padding: 0.5rem 1rem
      color: #ffffff
      font-weight: bolder
      width: max-content
    &-title
      font-size: 1.4rem
</style>