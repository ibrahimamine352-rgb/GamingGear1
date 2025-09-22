
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
      <div tw="bg-purple-900 relative flex items-center justify-center">
        <div tw="w-[300px] h-[450px] flex items-center ">
        <img tw="w-[300px]" src={prod?.images[0].url} alt={prod?.name}  />
        </div>
       
        <div  tw=" flex flex-col w-[600px]  ">
            <p tw="text-white text-4xl flex font-bold m-5">{prod?.name}</p>
            <p tw="text-white text-md flex font-bold m-5">{prod?.description}</p>
        </div>
      </div>
    ),
    size
  );
}