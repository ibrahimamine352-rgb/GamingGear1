import Image from "next/image";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart, { PCCustom, PackCustom } from "@/hooks/use-cart";
import { Product } from "@/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";


interface CartItemProps {
  data: PackCustom; 
}

const PackCartItem: React.FC<CartItemProps> = ({
  data
}) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.idd);
  };
  const [seeMore,setSeeMore]=useState(false)
  return ( 
    <li className="flex py-6 border-b">
      <Card className="w-full bg-purple-100/80 dark:bg-purple-950/80">
        <CardTitle className="flex px-3 py-6 border-b">
        <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
         {
         data.packImage?<>   <Image
         fill
         src={data.packImage.toString()}
         alt="" 
         className="object-cover object-center"
       /></>:<></>
         }
     
      </div>

      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className=" text-lg font-semibold text-black dark:text-purple-500">
            {data.Title}
            </p>
          </div>

          <div className="mt-1 flex text-sm">
           
          </div>
          <Currency value={data.price} />
        </div>
      </div>


      
        </CardTitle>
        <CardContent className="p-0 dark:text-white">
        {seeMore ? (
  <>
    {Object.entries(data).map(([filterKey, filter]) => {
      const da = filter;

      if (typeof da === 'object' && da !== null && !Array.isArray(da)) {
        const item = da as Product;
        
        return <>
         {filterKey=='defaultKeyboard'?(<div className="font-semibold m-2">Clavier :</div>):<></>}
         {filterKey=='processor'?(<div className="font-semibold m-2">Processeur :</div>):<></>}
         {filterKey=='gpu'?(<div className="font-semibold m-2">Carte Graphique :</div>):<></>}
         {filterKey=='disk'?(<div className="font-semibold m-2">Disque dure :</div>):<></>}
         {filterKey=='power'?(<div className="font-semibold m-2">Bloc d&apos;alimentation :</div>):<></>}
         {filterKey=='case'?(<div className="font-semibold m-2">Boitier :</div>):<></>}
         {filterKey=='screen'?(<div className="font-semibold m-2">Ecran :</div>):<></>}
         {filterKey=='cooling'?(<div className="font-semibold m-2">Refroidisseur CPU :</div>):<></>}
        
        
        <It className={'flex py-6 border-b'} item={item} key={item.id} /></>;
      }

      if (Array.isArray(da)) {
        return (
          <>
          {filterKey=='ram'?(<div className="font-semibold m-2">Barette Ram :</div>):<></>}
            {da.map((e, k) => (
            <>  
              <It className={k==da.length?'flex py-6 border-b':'flex py-6 '} item={e} key={e.id} />
            </>
            ))}
          </>
        );
      }

      return null;
    })}
  </>
) : (
  <></>
)}


      <div onClick={()=>setSeeMore(!seeMore)} className="w-full text-center cursor-pointer font-bold text-sm p-1 text-gray-500 hover:underline">{seeMore?<>Voir moins</>:<>Voir plus</>}</div>
        </CardContent>
      </Card>
    
    </li>
  );
}
 
const It=(props:{item:Product,className:string})=>{
  console.log(props.item,props.item.images)
  
if(props.item.images){
  return(<>
    <li className={props.className}>
        <div className=" ml-3 relative h-8 w-8 rounded-md overflow-hidden sm:h-20 sm:w-20">
          <Image
            fill
            src={props.item.images[0].url}
            alt=""
            className="object-cover object-center"
          />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div className="flex justify-between">
              <p className="  font-semibold text-sm text-black dark:text-white">
                {props.item.name}
              </p>
            </div>
  
            <div className="mt-1 flex text-sm">
             
            </div>
            <Currency value={props.item.price} />
          </div>
        </div>
      </li>
  
  </>)
}else{
  return
}

}
export default PackCartItem;
