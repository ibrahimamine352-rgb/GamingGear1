'use client'

import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from "@nextui-org/react";
import { Button } from '@mantine/core'

interface PaginationControlsProps {
  hasNextPage: boolean
  hasPrevPage: boolean
  pagetotal:number
  perpage:number
  pageindex:number
}

const PaginationControls: FC<PaginationControlsProps> = (
  {
    hasNextPage, 
    hasPrevPage,
    pagetotal,
    perpage,
    pageindex
  }
) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cat= searchParams.get('categorie') ?? ''
  const search= searchParams.get('search') ?? ''
  const page = searchParams.get('page') ?? '1'
  const per_page =perpage


  const updateUrl = (newPage: number) => {
     const params = new URLSearchParams(window.location.search);

   // Check if "page" parameter exists
   if (params.has('page')) {
    // Replace the value of the existing "page" parameter
    params.set('page', newPage.toString());
  } else {
    // Add a new "page" parameter
    params.append('page', newPage.toString());
  }
  
 
  const queryString = params.toString();
    router.push(`/shop?${queryString}`);
    router.refresh();
  };
  
  return (
    <div className='flex gap-2'>

<div className="flex flex-col gap-5">
    
    {pagetotal>0?  <Pagination
      isCompact showControls
        total={pagetotal}
        color="secondary"
        page={pageindex}
        onChange={(e)=>{
        
          updateUrl(Number(e))
          
            router.refresh()
        }}
      />:<></>}

    
    
    </div>
    
    </div>
  )
}

export default PaginationControls