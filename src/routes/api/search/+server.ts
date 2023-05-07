import type {Product} from "$lib/server/db/types";
import {getProducts, searchProducts} from "$lib/server/db";
import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";

export const GET = (({ url }) => {
  const searchQuery = url.searchParams.get('q')?.toString();
  console.log('Query: ', searchQuery);

  let products: Product[] = [];

  if (searchQuery) {
    products = searchProducts(searchQuery);
  } else {
    products = getProducts();
  }
  return json(products);
}) satisfies RequestHandler;