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
const [searchTerm, setSearchTerm] = useState('');

const MotherboardCOl: React.FC<motherboardpar> = ({motherboards}) => {
    
  

const search= async (params:any) => {
  
  
    console.log(motherboards)
}
const filteredMotherboards = motherboards.filter((prod) => {
    // You can customize this filter logic based on your requirements.
    // This example filters products whose name contains the search term.
    return prod.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div>

          
        <div className='sm:w-full md:w-96 w-96'>
            <Input onChange={(e)=>{search(e)}} type='text' placeholder='Search'/>
        </div>
        
        <div className='rounded-md border-slate-500 grid col-span-4 col-'>
           {
           motherboards.map((prod)=>(<>

           <div className=''>
           {prod.images.length>0?(
            <> <Image src={prod.images[0].url} width={40} height={40} /></>
           ):(<></>)

           }
           </div>
         
          
           
           </>))
           }
        </div>

    </div>
  )
}


export default MotherboardCOl