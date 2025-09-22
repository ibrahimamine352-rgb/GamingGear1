import ProductList from '@/components/product-list'
import Gallery from '@/components/gallery';
import Info from '@/components/info';
import Container from '@/components/ui/container';
import prismadb from '@/lib/prismadb';
import { Product } from '@/types';

export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  },
}

const ProductPage: React.FC<ProductPageProps> = async ({ 
  params
 }) => {
  const product = await prismadb.product.findFirst({
    where:{
      id:params.productId
    },
    include:
    { images:true,
      category:true,
      additionalDetails: true}
  });
  const suggestedProducts = await prismadb.product.findMany({
    where:{
      categoryId: product?.category?.id
    } ,
    include:{
         images:true,
         category:true,
         cases:true,
         cpus:true,
         gpus:true,
         memories:true,
         motherboard:true,
         orderItems:true,
         powersupplies:true,
         storages:true,
         additionalDetails:true
    },
     orderBy: {
      updatedAt: 'desc' // Replace with your actual date field (e.g., 'createdAt')
    },
    
take:4
  });


  const formattedproducts: Product[] = suggestedProducts.map((item) => ({
    id: item.id,
    name: item.name,
    images:item.images,
    price: parseFloat(item.price.toString()),
    category: item.category,
    description:item.description,
    additionalDetails: item?.additionalDetails
    
  }));
  if (!product) {
    return null;
  }
  const formattedproduct: Product={ id: product?.id,
    name: product?.name,
    images: product?.images,
    price: parseFloat(product?.price?.toString()),
    category: product?.category,
    description:product.description,
    additionalDetails: product?.additionalDetails
  }

console.log(product)
  return (
    <div className="bg-[#ffffffe6]  dark:bg-[#000000e6] rounded-lg container my-10">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={formattedproduct} />
            </div>
          </div>
          <hr className="my-10" />
          <ProductList title="Related Items" items={formattedproducts} />
        </div>
      </Container>
    </div>  
  )
}

export default ProductPage;
