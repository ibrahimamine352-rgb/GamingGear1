
import prismadb from "@/lib/prismadb";
import { ImageResponse } from "next/server";

export const size = {
  width: 900,
  height: 450,
};

export const contentType = "image/png";

interface Props {
  params: {
    productId: string;
  };
}

export default async function og({ params }: Props) {
  const prod = await prismadb.product.findFirst({
    where:{id:params.productId},
    include:{
        images:true
    }
  })
  return new ImageResponse(
    (
      <div tw="bg-violet-900 relative flex items-center justify-center">
        <div tw="w-[400px] h-[450px] flex items-center ">
        <img tw="w-[400px]" src={prod?.images[0].url} alt={prod?.name}  />
        </div>
       
        <div  tw=" flex flex-col w-[500px]  ">
            <p tw="text-fuchsia-600 text-4xl flex font-black m-5">{prod?.name}</p>
            <p tw="text-pink-300 text-md flex font-bold m-5">{prod?.description}</p>
        </div>
        <div tw="w-[150px]  flex items-start absolute ml-3  bottom-0 ">
        <img tw="w-[100px]" src="https://gaminggear.tn/images/logo%20(3).png" alt={prod?.name}  /> 
    
        </div>
         </div>

    ),
    size
  );
}