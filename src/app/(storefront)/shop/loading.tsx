import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
    <div className="w-full h-full p-8">
      <div className="flex mx-auto px-4 py-10 sm:px-6 max-w-7xl lg:px-8">
        <div className="lg:grid w-1/3 mx-3 lg:grid-cols-1 lg:items-start lg:gap-x-8">
          <Skeleton className="rounded-xl aspect-square" />
         
        </div>
        <div className=" w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
        </div> 
      </div>
    </div>
  </Container>
  );
}
 
export default Loading;
