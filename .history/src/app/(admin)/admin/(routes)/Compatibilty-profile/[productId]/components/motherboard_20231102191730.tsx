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
    const [motherboardList, setSotherboardList] = useState([]);
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

          
        <h3 className='font-semibold'>Motherboard</h3>
        <div className='m-5 mx-0 p-3 border-1 border-slate-200  dark:border-slate-800 rounded-lg grid col-span-6'>
            {motherboardList.length==0?<>
            <div className='h-52 w-36 bg-slate-100 rounded-lg  text-slate-700  dark:bg-slate-800 justify-center flex align-middle items-center '>
            <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40}  version="1.1" x="0px" y="0px" viewBox="0 0 44 55" enable-background="new 0 0 44 44" ><g><path fill="" d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z"/></g></svg>
            </div>
            </>:   <></>}
             
        </div>
        
      </div>
       

  )
}


export default MotherboardCOl