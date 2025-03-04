import { Product } from "./product.type";

export interface UserCart {
  id: number;
  userId: number;
  products: Product[];
}
