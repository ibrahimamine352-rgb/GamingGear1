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
      const getpcs: () => Promise<CartItem[]>= async () =>{
        const pcsz =  await Promise.all((facture?.orderPc || []).map(async (e) => {
       
            const motherboard =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            
            const processor =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            const gpu =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            const ram =await prismadb.product.findMany({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            const disk =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            const disk2 =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            const power =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            const screen =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            const cooling =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
    
            const casee =await prismadb.product.findUnique({
                where:{
                    id:e.motorderItemId
                }
                , 
                        
                        include:{
                            images:true,
                            category:true,
                            additionalDetails:true
                        }
                
            })
            if (!motherboard) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!processor) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!gpu) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!ram) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!disk) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!disk2) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!power) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }

              if (!casee) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!screen) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
              if (!cooling) {
                // Handle the case when motherboard is null, e.g., throw an error, provide a default product, etc.
                throw new Error("Motherboard not found");
              }
            console.log(e)
            return {
                idd:e.id,
                price:parseInt(e.price.toString()),
                motherboard:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                processor:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                gpu:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                ram:[],
                disk:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                disk2:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                power:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                case:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                screen:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                cooling:{...motherboard,price:parseInt(motherboard.price.toString()),stock:parseInt(motherboard.stock.toString())},
                number:1
            }
            
                  }))

        return pcsz
      }
      let pcs: CartItem[] =[]
      if(facture&&facture?.orderPc.length>0){

      
             const d= await getpcs()
                  return(<>

                    <Invoice invoiceData={[...itemsData,...d]}/>
                    
                    </>)
      }else{
        return(<>

            <Invoice invoiceData={[...itemsData]}/>
            
            </>)
      }
  

   
  }
  
  export default ProductPage