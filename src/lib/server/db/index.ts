import type {Filter, ProductType, SearchFilters} from "./types";
import {Brand, Category, Product, Subcategory} from "$lib/sql/Sequelize";
import type {WhereOptions} from "sequelize";
import {Op} from "sequelize";

// TODO: fix the typescript errors fhhljfajlshgjkhdjgklh

export async function getProducts(productName = '', filter: Filter = {}, start = 0, limit = 24): Promise<ProductType[]> {
  const where: WhereOptions[] = [];
  if (productName.length > 0) {
    where.push({ productName: { [Op.like]: productName } });
  }
  if (filter && filter.brandId) {
    where.push({ brandId: filter.brandId });
  }
  if (filter && filter.categoryId) {
    where.push({ categoryId: filter.categoryId });
  }
  if (filter && filter.subcategoryId) {
    where.push({ subcategoryId: filter.subcategoryId });
  }

  const query = {
    include: [
      { model: Brand, as: 'brand', attributes: ['name'] },
      { model: Category, as: 'category', attributes: ['name'] },
      { model: Subcategory, as: 'subcategory', attributes: ['name'] },
    ],
    where: { [Op.and]: where },
    offset: start,
    limit: limit,
    raw: true,
  };
  return await Product.findAll(query);
}

export async function getProduct(id: number): Promise<ProductType | null> {
  const query = {
    include: [
      { model: Brand, as: 'brand', attributes: ['name'] },
      { model: Category, as: 'category', attributes: ['name'] },
      { model: Subcategory, as: 'subcategory', attributes: ['name'] },
    ],
    where: { id: id },
  };
  const result = await Product.findOne(query);
  return result?.toJSON() ?? null;
}

export function getSearchFilters(): SearchFilters {
  const filters: SearchFilters = {
    brand: [],
    category: [],
    subcategory: [],
    min_price: 0,
    max_price:0,
  };

  // const sql_brands = `SELECT distinct Brand AS title, COUNT(*) AS \`count\` FROM products GROUP BY Brand ORDER BY Brand ASC;`;
  // const sql_categories = `SELECT distinct Category AS title, COUNT(*) AS \`count\` FROM products GROUP BY Category ORDER BY Category ASC;`;
  // const sql_subcategories = `SELECT distinct SubCategory AS title, COUNT(*) AS \`count\` FROM products GROUP BY SubCategory ORDER BY SubCategory ASC;`;
  // const sql_prices = `SELECT CASE WHEN MIN(Price) < MIN(DiscountPrice) THEN MIN(Price) ELSE MIN(DiscountPrice) END AS min_price,
  //   (CASE WHEN MAX(Price) < MAX(DiscountPrice) THEN MAX(DiscountPrice) ELSE MAX(Price) END) as max_price
  //   FROM products;`;
  //
  // conn.execute(sql_brands, (errors, results: SearchFilter[]) => filters.brand = results);
  // conn.execute(sql_categories, (errors, results: SearchFilter[]) => filters.category = results);
  // conn.execute(sql_subcategories, (errors, results: SearchFilter[]) => filters.subcategory = results);
  // conn.execute(sql_prices, (errors, results: { min_price: number; max_price: number }[]) => {
  //   if (results && results.length > 0) {
  //     filters.min_price = results[0].min_price;
  //     filters.max_price = results[0].max_price;
  //   }
  // });
  // const stmt = db.prepare(sql_brands);
  // filters.brand = stmt.all() as SearchFilter[];

  // const stmt_cat = db.prepare(sql_categories);
  // filters.category = stmt_cat.all() as SearchFilter[];
  //
  // const stmt_sub = db.prepare(sql_subcategories);
  // filters.subcategory = stmt_sub.all() as SearchFilter[];
  //
  //
  // const stmt_price = db.prepare(sql_prices);
  // const prices = stmt_price.get() as { min_price: number, max_price: number };
  // filters.min_price = prices.min_price;
  // filters.max_price = prices.max_price;

  return filters;
}
