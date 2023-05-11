import {getProduct} from "$lib/server/db";
import type { PageServerLoad } from './$types';
import type {ProductType} from "$lib/server/db/types";

export const load = (($page) => {
  const product: ProductType = getProduct(parseInt($page.params.id));
  return {
    product
  };
}) satisfies PageServerLoad;
