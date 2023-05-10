import Database from "better-sqlite3";
import type {Product, Filter, ProductsQuery, SearchFilters, SearchFilter} from "./types";
import mysql from 'mysql2';

const db = new Database('./data/products.db', { verbose: console.log, fileMustExist: true });
db.pragma('journal_mode = WAL');

const conn = mysql.createConnection({
  host: 'localhost',
  user: __SVELTEKIT_DEV__ ? 'root' : 'BossOfThisStore',
  password: __SVELTEKIT_DEV__ ? '' : '#VeryPassword123',
  database: 'products'
});

function clearString(str: string | undefined): string | undefined {
  if (!str) {
    return undefined;
  }
  str = decodeURIComponent(str);
  return str.replaceAll('&', '_');
}

export function getProducts(filter: Filter = {}, start = 0, limit = 24): Product[] {
  let sql = `SELECT * FROM products LIMIT $start, $limit;`;
  const params: ProductsQuery = {
    start: start,
    limit: limit,
  };
  const b = clearString(filter.Brand);
  const c = clearString(filter.Category);
  const s = clearString(filter.SubCategory);
  if (b) {
    params.b = b;
  }
  if (c) {
    params.c = c;
  }
  if (s) {
    params.s = s;
  }

  if (b || c || s) {
    if (b && c && s) {
      sql = `SELECT * FROM products WHERE Brand LIKE $b AND Category LIKE $c AND SubCategory LIKE $s LIMIT $start, $limit;`;
    } else {
      if (b && c) {
        sql = `SELECT * FROM products WHERE Brand LIKE $b AND Category LIKE $c LIMIT $start, $limit;`;
      }
      if (b && s) {
        sql = `SELECT * FROM products WHERE Brand LIKE $b AND SubCategory LIKE $s LIMIT $start, $limit;`;
      }
      if (c && s) {
        sql = `SELECT * FROM products WHERE Category LIKE $c AND SubCategory LIKE $s LIMIT $start, $limit;`;
      }
      if (b) {
        sql = `SELECT * FROM products WHERE Brand LIKE $b LIMIT $start, $limit;`;
      }
      if (c) {
        sql = `SELECT * FROM products WHERE Category LIKE $c LIMIT $start, $limit;`;
      }
      if (s) {
        sql = `SELECT * FROM products WHERE SubCategory LIKE $s LIMIT $start, $limit;`;
      }
    }
  }

  const stmt = db.prepare(sql);
  const rows = stmt.all(params);
  return rows as Product[];
}

export function searchProducts(query = '', start = 0, limit = 24): Product[] {
  let rows: Product[] = [];
  const searchQuery = `%${query}%`;
  conn.execute(`SELECT * FROM products.products
    JOIN products.brand b ON brandId = b.id
    WHERE productName LIKE ? OR b.name LIKE ?
    LIMIT ?, ?;`,
    [searchQuery, searchQuery, start, limit],
    (err, results: Product[]) => {
      rows = results;
    }
  );
  return rows;
}

export function getProduct(id: number): Product {
  const sql = `SELECT * FROM products WHERE id = $id;`;
  const stmt = db.prepare(sql);
  const row = stmt.get({ id });
  return row as Product;
}

export function getSearchFilters(): SearchFilters {
  const filters: SearchFilters = {
    brand: [],
    category: [],
    subcategory: [],
    min_price: 0,
    max_price:0,
  };

  const sql_brands = `SELECT distinct Brand AS title, COUNT(*) AS \`count\` FROM products GROUP BY Brand ORDER BY Brand ASC;`;
  const stmt = db.prepare(sql_brands);
  filters.brand = stmt.all() as SearchFilter[];

  const sql_categories = `SELECT distinct Category AS title, COUNT(*) AS \`count\` FROM products GROUP BY Category ORDER BY Category ASC;`;
  const stmt_cat = db.prepare(sql_categories);
  filters.category = stmt_cat.all() as SearchFilter[];

  const sql_subcategories = `SELECT distinct SubCategory AS title, COUNT(*) AS \`count\` FROM products GROUP BY SubCategory ORDER BY SubCategory ASC;`;
  const stmt_sub = db.prepare(sql_subcategories);
  filters.subcategory = stmt_sub.all() as SearchFilter[];

  const sql_prices = `SELECT CASE WHEN MIN(Price) < MIN(DiscountPrice) THEN MIN(Price) ELSE MIN(DiscountPrice) END AS min_price,
    (CASE WHEN MAX(Price) < MAX(DiscountPrice) THEN MAX(DiscountPrice) ELSE MAX(Price) END) as max_price
    FROM products;`;
  const stmt_price = db.prepare(sql_prices);
  const prices = stmt_price.get() as { min_price: number, max_price: number };
  filters.min_price = prices.min_price;
  filters.max_price = prices.max_price;

  return filters;
}
