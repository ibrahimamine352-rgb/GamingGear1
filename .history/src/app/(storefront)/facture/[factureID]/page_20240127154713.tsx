interface ProductPageProps {
    params: {
        factureID: string;
    },
  }
  
 export const ProductPage: React.FC<ProductPageProps> = async ({
    params
  }) => {


    return(<>
    {params.factureID}
    
    </>)
  }