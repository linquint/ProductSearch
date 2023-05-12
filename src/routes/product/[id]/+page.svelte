<script lang="ts">
  import type {PageData} from './$types';
  export let data: PageData;

  const clearString = (str: string): string => {
    return encodeURIComponent(str);
  }
</script>

<svelte:head>
  {#if data}
    <title>
      {data.productName}
    </title>
  {:else}
    <title>Product not found</title>
  {/if}
</svelte:head>

<div class="item-details">
  {#if data}
    <div class="categories">
      <a href="/">Products</a>
      <span>>></span>
      <a href={`/?category=${clearString(data.category.name)}`}>{data.category.name}</a>
      {#if data.subcategory.name}
        <span>>></span>
        <a href={`/?subcategory=${clearString(data.subcategory.name)}`}>{data.subcategory.name}</a>
      {/if}
    </div>
    <div class="item-details-row">
      <img src={data.imageUrl} alt={data.productName}>
      <div>
        <span class="item-brand">{data.brand.name}</span>
        <span class="item-title">{data.productName}</span>

        <div class="item-details-prices">
          <span class={`item-details-price ${!(data.price === data.discountPrice) ? 'item-details-price-old' : ''}`}>
            €{data.price.toFixed(2)}
          </span>
          {#if !(data.price === data.discountPrice)}
            <span class="item-details-sale">€{data.discountPrice.toFixed(2)}</span>
          {/if}
        </div>

        <span class="item-details-quantity">Quantity: <strong>{data.quantity}</strong></span>
      </div>
    </div>
  {/if}
  {#if !data}
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