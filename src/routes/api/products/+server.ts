import type {Filter} from "$lib/server/db/types";
import {getProducts} from "$lib/server/db";
import type {RequestHandler} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";

export const GET = (({url}) => {
  const brand = url.searchParams.get('brand')?.toString();
  const category = url.searchParams.get('category')?.toString();
  const subcategory = url.searchParams.get('subcategory')?.toString();
  const start = parseInt(url.searchParams.get('start') || '0')
  const filter: Filter = {
    Brand: brand,
    Category: category,
    SubCategory: subcategory,
  };

  const products = getProducts(filter, start);
  return json(products);
}) satisfies RequestHandler;