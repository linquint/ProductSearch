import type {Filter} from "$lib/server/db/types";
import {getProducts} from "$lib/server/db";
import type {RequestHandler} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";

export const GET = (async ({url}) => {
  const query = url.searchParams.get('q')?.toString() || '';
  const brand = url.searchParams.get('brand')?.toString();
  const category = url.searchParams.get('category')?.toString();
  const subcategory = url.searchParams.get('subcategory')?.toString();
  const start = parseInt(url.searchParams.get('start')?.toString() || '0');
  const filter: Filter = {
    brandId: brand ? parseInt(brand) : undefined,
    categoryId: category ? parseInt(category) : undefined,
    subcategoryId: subcategory ? parseInt(subcategory) : undefined,
  };

  const products = await getProducts(query, filter, start);
  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
}) satisfies RequestHandler;