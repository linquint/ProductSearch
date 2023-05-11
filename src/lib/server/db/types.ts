export interface IProductCreate {
  productName: string;
  brandId: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  quantity: string;
  categoryId: string;
  subcategoryId: string;
  absoluteUrl: string;
}
export interface IProduct extends IProductCreate {
  id: number;
}

export interface IProductPropsCreate {
  name: string;
}
export interface IProductProps extends IProductPropsCreate {
  id: number;
}

export type ProductType = {
  id: number;
  productName: string;
  brandId: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  quantity: string;
  categoryId: string;
  subcategoryId: string;
  absoluteUrl: string;
  brand: IProductProps;
  category: IProductProps;
  subcategory: IProductProps;
};

export type Filter = {
  brandId?: number | undefined;
  categoryId?: number | undefined;
  subcategoryId?: number | undefined;
};

export type SearchFilter = {
  title: string;
  count: number;
};

export type SearchFilters = {
  brand: SearchFilter[];
  category: SearchFilter[];
  subcategory: SearchFilter[];
  min_price: number;
  max_price: number;
};
