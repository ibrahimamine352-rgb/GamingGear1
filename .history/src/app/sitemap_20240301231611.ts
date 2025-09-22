export default async function sitemap() {
    const baseUrl="https://gaminggear.tn"

    const productUrl=""
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
    ]
    
}