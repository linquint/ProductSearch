import {getSearchFilters} from "$lib/server/db";
import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";

export const GET = (async () => {
  return json({ success: true, filters: getSearchFilters() });
}) satisfies RequestHandler;