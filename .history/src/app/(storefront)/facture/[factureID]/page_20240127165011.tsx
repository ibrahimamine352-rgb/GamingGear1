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
            orderPc:{
                include:{
                    case:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    cooling:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    disk:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    gpu:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    motherboard:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    power:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    processor:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    ram:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                    screen:{ include:{product:{
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                    }}},
                }
            }
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
      const pcs: CartItem[] = (facture?.orderPc || []).map((e) => {

return {
    idd:e.id,
    price:parseInt(e.price.toString()),
    motherboard:e.motherboard[0] as unknown as Product,
    processor: e.processor[0] as unknown as Product,
    gpu: e.gpu[0] as unknown as Product,
    ram: e.ram as unknown[] as Product[],
    disk: e.disk[0] as unknown as Product,
    disk2: e.disk[1] as unknown as Product,
    power: e.power[0] as unknown as Product,
    case: e.case[0] as unknown as Product,
    screen: e.screen[0] as unknown as Product,
    cooling: e.cooling[0] as unknown as Product,
    number:1
}

      })
      console.log(itemsData)
    return(<>

    <Invoice invoiceData={[...itemsData,...pcs]}/>
    
    </>)
  }
  
  export default ProductPage