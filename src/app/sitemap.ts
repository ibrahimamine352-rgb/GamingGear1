import prismadb from "@/lib/prismadb"

export default async function sitemap() {
    const baseUrl="https://gaminggear.tn"
  
        const products=await prismadb.product.findMany()
    const productUrls=products.map((product)=>({
        url:`${baseUrl}/product/${product.id}`,
        lastModified: product.updatedAt
    }))
    return[
        {
            url:baseUrl,
            lastModified: new Date( )
        },
        {
            url:`${baseUrl}/build-pc`,
            lastModified: new Date( )
        },
        {
            url:`${baseUrl}/cart`,
            lastModified: new Date( )
        },
        {
            url:`${baseUrl}/shop`,
            lastModified: new Date( )
        },
        ...productUrls
    ]
    
}