
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
      <div tw="relative flex items-center justify-center">
        <div tw="w-[300px] h-[900px] flex items-center">
        <img tw="w-[300px]" src={prod?.images[0].url} alt={prod?.name}  />
        </div>
       
        <div  tw=" flex items-center w-[600px] ">
            <p tw="text-black text-4xl flex font-bold m-5">{prod?.name}</p>
        </div>
      </div>
    ),
    size
  );
}