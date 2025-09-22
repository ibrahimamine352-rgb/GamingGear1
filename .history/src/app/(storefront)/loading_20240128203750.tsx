"use client";

import { Loader } from "@/components/ui/loader";

const Loading = () => {
  return ( 
    <div className="flex h-full p-56 my-10 mx-10 bg-white dark:bg-black bg-opacity-20 dark:bg-opacity-20 w-full items-center justify-center">
      <Loader />
    </div>
   );
}
 
export default Loading;