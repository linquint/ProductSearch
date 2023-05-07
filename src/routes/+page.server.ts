import {getProducts} from "$lib/server/db";
import type { PageServerLoad } from './$types';
import type {Filter} from "$lib/server/db/types";

export const load = (($page) => {
  const brand = $page.url.searchParams.get('brand')?.toString();
  const category = $page.url.searchParams.get('category')?.toString();
  const subcategory = $page.url.searchParams.get('subcategory')?.toString();
  const filter: Filter = {
    Brand: brand,
    Category: category,
    SubCategory: subcategory,
  };

  const products = getProducts(filter);
  return {
    products
  };
}) satisfies PageServerLoad;