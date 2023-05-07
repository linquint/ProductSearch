import {getProduct} from "$lib/server/db";
import type { PageServerLoad } from './$types';

export const load = (($page) => {
  const product = getProduct(parseInt($page.params.id));
  return {
    product
  };
}) satisfies PageServerLoad;
