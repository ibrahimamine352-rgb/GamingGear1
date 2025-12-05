import prismadb from "@/lib/prismadb"
import { slugify } from "@/lib/slugify";  // ⬅️ add this at top

export default async function sitemap() {
    const baseUrl="https://gaminggeartn.tn"
  
        const products=await prismadb.product.findMany()
    const productUrls=products.map((product)=>({
        url: `${baseUrl}/product/${slugify(product.name)}-${product.id}`,
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