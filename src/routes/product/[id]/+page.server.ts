import {getProduct} from "$lib/server/db";
import type { PageServerLoad } from './$types';
import type {IProduct} from "$lib/server/db/types";

export const load = (async ($page) => {
  const product: IProduct | undefined = (await getProduct(parseInt($page.params.id)));
  return {
    ...product
  };
}) satisfies PageServerLoad;
