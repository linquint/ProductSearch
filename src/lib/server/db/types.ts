export type Product = {
  id: number;
  ProductName: string;
  Brand: string;
  Price: number;
  DiscountPrice: number;
  Image_Url: string;
  Quantity: string;
  Category: string;
  SubCategory: string;
}

export type Filter = {
  Brand?: string;
  Category?: string;
  SubCategory?: string;
}

export type ProductsQuery = {
  b?: string;
  c?: string;
  s?: string;
  start: number;
  limit: number;
}