import { Product } from "./product.type";

export interface UserWishlist {
  id: number;
  userId: number;
  products: Product[];
}
