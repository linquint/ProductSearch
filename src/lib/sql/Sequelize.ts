import {Model, Sequelize} from "sequelize";
import {BrandModel, CategoryModel, ProductsModel, SubcategoryModel} from "$lib/sql/models";
import type {IProduct, IProductCreate, IProductProps, IProductPropsCreate} from "$lib/server/db/types";

const username = __SVELTEKIT_DEV__ ? 'root' : 'root';
const password = __SVELTEKIT_DEV__ ? 'bananas' : 'N3zinau!';
const dialect = __SVELTEKIT_DEV__ ? 'mariadb' : 'mysql';

const sql = new Sequelize('products', username, password, {
  host: 'localhost',
  dialect: dialect,
});

export const Brand = sql.define<Model<IProductProps, IProductPropsCreate>>('brand', BrandModel, {
  timestamps: false, freezeTableName: true,
});
export const Category = sql.define<Model<IProductProps, IProductPropsCreate>>('category', CategoryModel, {
  timestamps: false, freezeTableName: true,
});
export const Subcategory = sql.define<Model<IProductProps, IProductPropsCreate>>('subcategory', SubcategoryModel, {
  timestamps: false, freezeTableName: true,
});
export const Product = sql.define<Model<IProduct, IProductCreate>>('products', ProductsModel, {
  timestamps: false,
  freezeTableName: true,
  indexes: [
    {
      unique: true,
      name: 'products_brandId_categoryId_subcategoryId_idx',
      fields: ['brandId', 'categoryId', 'subcategoryId']
    }
  ],
});

Product.belongsTo(Brand);
Product.belongsTo(Category);
Product.belongsTo(Subcategory);

Brand.hasMany(Product);
Category.hasMany(Product);
Subcategory.hasMany(Product);

try {
  await sql.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sql;