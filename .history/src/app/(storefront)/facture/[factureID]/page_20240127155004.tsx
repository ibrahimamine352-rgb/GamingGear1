import prismadb from "@/lib/prismadb";

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
            id:params.factureID
        }
    })

    return(<>
    {params.factureID}
    
    </>)
  }
  
  export default ProductPage