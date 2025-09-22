import { Product } from "@/types";



const gettoatl = async (keyword: string): Promise<Product> => {
  const res = await fetch(`/${id}`);

  return res.json();
};

export default getProduct;
