"use client";

import { Loader } from "@/components/ui/loader";

const Loading = () => {
  return ( 
    <div className="h-full w-full    px-10">
    <div className="flex h-full py-40  my-10   bg-white dark:bg-black bg-opacity-40 dark:bg-opacity-40 w-full items-center justify-center">

    <Loader />
   </div>
   
    
    </div>
   );
}
 
export default Loading;