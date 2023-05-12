import type {Filter} from "$lib/server/db/types";
import {getProducts} from "$lib/server/db";
import type {RequestHandler} from "@sveltejs/kit";

export const GET = (async ({url}) => {
  const query = url.searchParams.get('q')?.toString() || '';
  const brand = url.searchParams.get('brand')?.toString();
  const category = url.searchParams.get('category')?.toString();
  const subcategory = url.searchParams.get('subcategory')?.toString();
  const start = parseInt(url.searchParams.get('start')?.toString() || '0');
  const min = parseFloat(url.searchParams.get('min')?.toString() || '0.00');
  const max = parseFloat(url.searchParams.get('max')?.toString() || '9999.99');
  const filter: Filter = {
    brandId: brand ? parseInt(brand) : undefined,
    categoryId: category ? parseInt(category) : undefined,
    subcategoryId: subcategory ? parseInt(subcategory) : undefined,
    min,
    max,
  };

  const products = await getProducts(query, filter, start);
  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
}) satisfies RequestHandler;