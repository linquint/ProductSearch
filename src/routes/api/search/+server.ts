import type {IProduct} from "$lib/server/db/types";
import {getProducts} from "$lib/server/db";
import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";

export const GET = (async ({ url }) => {
  const searchQuery = url.searchParams.get('q')?.toString() || '';
  console.log('Query: ', searchQuery);

  let products: IProduct[] = [];

  if (searchQuery) {
    products = await getProducts(searchQuery);
  } else {
    products = await getProducts(searchQuery);
  }

  console.log(products);

  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
}) satisfies RequestHandler;