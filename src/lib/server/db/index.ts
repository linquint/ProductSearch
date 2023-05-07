import Database from "better-sqlite3";
import type {Product, Filter, ProductsQuery} from "./types";

const PATH = (__SVELTEKIT_DEV__) ? './data/products.db' : '/data/products.db';
const db = new Database(PATH, { verbose: console.log, fileMustExist: true });
db.pragma('journal_mode = WAL');

export function getProducts(filter: Filter = {}, start = 0, limit = 24): Product[] {
  let sql = `SELECT * FROM products LIMIT $start, $limit;`;
  const params: ProductsQuery = {
    start: start,
    limit: limit,
  };
  const b = filter.Brand;
  const c = filter.Category;
  const s = filter.SubCategory;
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
      sql = `SELECT * FROM products WHERE Brand = $b AND Category = $c AND SubCategory = $s LIMIT $start, $limit;`;
    } else {
      if (b && c) {
        sql = `SELECT * FROM products WHERE Brand = $b AND Category = $c LIMIT $start, $limit;`;
      }
      if (b && s) {
        sql = `SELECT * FROM products WHERE Brand = $b AND SubCategory = $s LIMIT $start, $limit;`;
      }
      if (c && s) {
        sql = `SELECT * FROM products WHERE Category = $c AND SubCategory = $s LIMIT $start, $limit;`;
      }
      if (b) {
        sql = `SELECT * FROM products WHERE Brand = $b LIMIT $start, $limit;`;
      }
      if (c) {
        sql = `SELECT * FROM products WHERE Category = $c AND LIMIT $start, $limit;`;
      }
      if (s) {
        sql = `SELECT * FROM products WHERE SubCategory = $s LIMIT $start, $limit;`;
      }
    }
  }

  const stmt = db.prepare(sql);
  const rows = stmt.all(params);
  return rows as Product[];
}

export function searchProducts(query = '', start = 0, limit = 24): Product[] {
  const q = `%${query}%`;
  const b = `%${query}%`;
  const sql = `
    SELECT * FROM products 
      WHERE ProductName LIKE $q OR Brand LIKE $b 
      LIMIT $start, $limit;
   `;
  const stmt = db.prepare(sql);
  const rows = stmt.all({ q, b, start, limit });
  return rows as Product[];
}

export function getProduct(id: number): Product {
  const sql = `SELECT * FROM products WHERE id = $id;`;
  const stmt = db.prepare(sql);
  const row = stmt.get({ id });
  return row as Product;
}
