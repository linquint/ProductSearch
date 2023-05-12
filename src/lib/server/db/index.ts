import type {Filter, IPriceRange, IProduct, SearchFilters} from "./types";
import sql, {Brand, Category, Product, Subcategory} from "$lib/sql/Sequelize";
import type {FindOptions, WhereOptions} from "sequelize";
import {col, Op} from "sequelize";

export async function getProducts(productName = '', filter: Filter = {}, start = 0, limit = 24): Promise<IProduct[]> {
  const where: WhereOptions[] = [];
  if (productName.length > 0) {
    where.push({ productName: { [Op.like]: `%${productName}%` } });
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
  if (filter && filter.min) {
    where.push({ discountPrice: { [Op.gte]: filter.min } });
  }
  if (filter && filter.max) {
    where.push({ discountPrice: { [Op.lte]: filter.max } });
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
  };
  return (await Product.findAll(query)).map(data => data.toJSON());
}

export async function getProduct(id: number): Promise<IProduct | undefined> {
  const query = {
    include: [
      { model: Brand, as: 'brand' },
      { model: Category, as: 'category' },
      { model: Subcategory, as: 'subcategory' },
    ],
  };
  const result = await Product.findByPk(id, query);
  return result?.toJSON();
}

export async function getSearchFiltersInit(): Promise<SearchFilters> {
  const queryOptions: FindOptions<IProduct> = {
    attributes: [
      'id', 'name', //[ sql.literal('SELECT count(*) FROM products WHERE brandId = brand.id'), 'count' ],
    ],
  }
  const [ brands, categories, subcategories, priceRange ] = await Promise.all([
    Brand.findAll(queryOptions),
    Category.findAll(queryOptions),
    Subcategory.findAll(queryOptions),
    Product.findOne({ attributes: [ [sql.fn('min', col('discountPrice')), "minPrice"], [sql.fn('max', col('discountPrice')), 'maxPrice'] ] }),
  ]);
  return {
    brand: brands.map(data => data.toJSON()),
    category: categories.map(data => data.toJSON()),
    subcategory: subcategories.map(data => data.toJSON()),
    minPrice: (priceRange?.toJSON() as IPriceRange).minPrice || 0,
    maxPrice: (priceRange?.toJSON() as IPriceRange).maxPrice || 0,
  };
}
