import prismadb from "@/lib/prismadb"
import { ImageResponse } from "next/dist/compiled/@vercel/og"


export const size={
    with:900,
    height:450
}
export const contentType="image/*"
interface Props{
    params:{
        productId:string
    }
}
export async function og({params}:Props) {
    const product=await prismadb.product.findFirst({where:{
        id:params.productId

    },include:{
        images:true
    }})


    return new ImageResponse((
    <div tw="relative flex item-center justify-center">
        <img src={product?.images[0].url} alt={product?.name} />
        <div tw="absolute flex bg-black opacity-50 inset-0"/>
        <div tw="absolute flex items-center top-2 w-full">
            <p tw="text-white text-4xl flex font-bold m-5">{product?.name}</p>
            <p tw="text-indigo-200 text-xl flex font-bold m-5">{product?.description}</p>
            <p tw="text-indigo-200 text-xl flex font-bold m-5">{product?.updatedAt?.toDateString()}</p>
        </div>
        
    </div>),size)
    
}