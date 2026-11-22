export type Product = {
  id: number;
  name: string;
  brand: string;
  description: string;
  style: string;
  price: string; 
  image_url: string | null;
  stock_quantity: number;
  category_id: number | null;
};