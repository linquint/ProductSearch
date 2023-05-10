export type Product = {
  id: number;
  productName: string;
  brand: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  quantity: string;
  category: string;
  subcategory: string;
  absoluteUrl: string;
}

export type Filter = {
  Brand?: string;
  Category?: string;
  SubCategory?: string;
}

export type AppliedFilter = {
  brand?: number | undefined;
  category?: number | undefined;
  subcategory?: number | undefined;
}

export type ProductsQuery = {
  b?: string;
  c?: string;
  s?: string;
  start: number;
  limit: number;
}

export type SearchFilter = {
  title: string;
  count: number;
}

export type SearchFilters = {
  brand: SearchFilter[];
  category: SearchFilter[];
  subcategory: SearchFilter[];
  min_price: number;
  max_price: number;
}