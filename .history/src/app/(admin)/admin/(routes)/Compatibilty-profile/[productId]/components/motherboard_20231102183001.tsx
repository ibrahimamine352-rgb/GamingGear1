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
        <div className="rounded-md p-5 border-slate-500 grid border-2 col-span-4 col-">
            {filteredMotherboards.length>0?         (<>{filteredMotherboards.map((prod: { id: React.Key | null | undefined; images: string | any[]; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined }) => (
          <div key={prod.id}>
            {prod.images.length > 0 ? (
              <Image src={prod.images[0].url} width={40} height={40} />
            ) : (
              <></>
            )}
            <span>{prod.name}</span>
          </div>
        ))}</>) :
            
    
            <></>

            }
        
      </div>
       

    </div>
  )
}


export default MotherboardCOl