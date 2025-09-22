import { Product } from "@/types";



const gettoatl = async (keyword: string): Promise<Product> => {

  const res = await fetch(`./api`);

  return res.json();
};

export default gettoatl;
