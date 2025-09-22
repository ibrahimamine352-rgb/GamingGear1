import Invoice from "@/components/front/Facture";
import { CartItem } from "@/hooks/use-cart";
import prismadb from "@/lib/prismadb";
import { Product } from '@/types';

interface ProductPageProps {
    params: {
        factureID: string;
    },
  }
  
  const ProductPage: React.FC<ProductPageProps> = async ({
    params
  }) => {
    const facture = await prismadb.order.findFirst({
        where:{
            id:params.factureID,
        
        },
        include:{
            orderItems:{
                include: {
                    product:{
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }}
                }
            },
            orderPc:true
        }
    })
    const itemsData: CartItem[] = (facture?.orderItems || []).map((e) => {
        // Assuming you want to extract relevant properties from 'e' to create a new 'CartItem'
        const { id, name, dicountPrice, description, price, stock, category, mouseId,images,additionalDetails, ...otherProperties } = e.product;
        if(e.numbers==''||"NaN"){
            const cartItem: CartItem = {
                id,
                name,
              additionalDetails,
                description,
                price:parseInt(price.toString()),
                stock:parseInt(stock.toString()),
                number:1,
      category,
      images
      
                // Include other properties as needed
              };
              return cartItem;
        }else{
            const cartItem: CartItem = {
                id,
                name,
              additionalDetails,
                description,
                price:parseInt(price.toString()),
                stock:parseInt(stock.toString()),
                number:parseInt(e.numbers),
      category,
      images
      
                // Include other properties as needed
              };
              return cartItem;
        }
        // Create a new 'CartItem' with the extracted properties
      
      
      
      });
      console.log(itemsData)
    return(<>

    <Invoice invoiceData={itemsData}/>
    
    </>)
  }
  
  export default ProductPage