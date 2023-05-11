import { writable, derived, type Writable } from 'svelte/store';
import type {SearchFilters, Filter, ProductType} from "$lib/server/db/types";

export const productsList: Writable<ProductType[]> = writable();
export const searchFilters: Writable<SearchFilters> = writable();
export const appliedFilters: Writable<Filter> = writable({
  brandId: undefined,
  categoryId: undefined,
  subcategoryId: undefined,
});
export const productPage: Writable<number> = writable(0);

export const productsLoaded = derived(productsList, $productsList => {
  return $productsList && $productsList.length > 0;
});
export const products = derived(productsList, $productsList => {
  return $productsList;
})

export const filtersLoaded = derived(searchFilters, $searchFilters => {
  return ($searchFilters && $searchFilters.min_price && $searchFilters.brand.length > 0);
});
export const brands = derived(searchFilters, $searchFilters => {
  if ($searchFilters && $searchFilters.brand && $searchFilters.brand.length > 0) {
    return $searchFilters.brand;
  }
  return [];
});
export const categories = derived(searchFilters, $searchFilters => {
  if ($searchFilters && $searchFilters.category && $searchFilters.category.length > 0) {
    return $searchFilters.category;
  }
  return [];
});
export const subcategories = derived(searchFilters, $searchFilters => {
  if ($searchFilters && $searchFilters.subcategory && $searchFilters.subcategory.length > 0) {
    return $searchFilters.subcategory;
  }
  return [];
});
export const priceRange = derived(searchFilters, $searchFilters => {
  if ($searchFilters && $searchFilters.min_price && $searchFilters.max_price) {
    return { min: $searchFilters.min_price, max: $searchFilters.max_price };
  }
  return { min: 0, max: 0 };
});
export const brandFilter = derived(appliedFilters, $appliedFilters => $appliedFilters.brandId);
export const categoryFilter = derived(appliedFilters, $appliedFilters => $appliedFilters.categoryId);
export const subcategoryFilter = derived(appliedFilters, $appliedFilters => $appliedFilters.subcategoryId);
export const productStart = derived(productPage, $productPage => $productPage * 24);
