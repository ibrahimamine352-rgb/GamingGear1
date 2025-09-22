"use client"
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Card, CardHeader } from '@/components/ui/card'
import { CardBody, Image } from '@nextui-org/react'
import { ProdCol } from '@/types'
import prismadb from '@/lib/prismadb'

type motherboardpar={
motherboards:ProdCol []
}

const MotherboardCOl: React.FC<motherboardpar> = ({motherboards}) => {
    
    const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchTerm(value);

   
      };
const filteredMotherboards = motherboards.filter((prod) => {
    // You can customize this filter logic based on your requirements.
    // This example filters products whose name contains the search term.
    if(searchTerm.length>0){
        return prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return 
   
  });
  return (
    <div>

          
        <div className='sm:w-full md:w-96 w-96'>
            <Input onChange={handleSearch} type='text' value={searchTerm} placeholder='Search'/>
        </div>

            {filteredMotherboards.length>0?         (<>        <div className="rounded-md p-2 m-2 w-max border-slate-300 border-opacity-60  border-1 "><div className='text-sm font-semibold'>Results:</div>{filteredMotherboards.map((prod: { id: React.Key | null | undefined; images: string | any[]; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined }) => (
          <div className='flex border-1 rounded-sm px-2 py-3 items-center' key={prod.id}>
            {prod.images.length > 0 ? (
              <Image src={prod.images[0].url} className='rounded-none  ' width={100} height={100} />
            ) : (
              <></>
            )}
            <span className='px-5 '>{prod.name}</span>
          </div>
        ))}</div></>) :
            <>
            <div>
                
            </div>
            
            </>

            }
        
      </div>
       

  )
}


export default MotherboardCOl