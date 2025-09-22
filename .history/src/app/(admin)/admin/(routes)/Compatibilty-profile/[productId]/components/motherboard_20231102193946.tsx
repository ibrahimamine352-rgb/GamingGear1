"use client"
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Card, CardHeader } from '@/components/ui/card'
import { CardBody, Image } from '@nextui-org/react'
import { ProdCol } from '@/types'
import prismadb from '@/lib/prismadb'
import Dialog from './dialog'

type motherboardpar={
motherboards:ProdCol []
}

const MotherboardCOl: React.FC<motherboardpar> = ({motherboards}) => {
    
    const [motherboardList, setSotherboardList] = useState([]);
    const [openDialg, setOpenDialg] = useState(false);
 
  return (
    <div>

          
        <h3 className='font-semibold'>Motherboard</h3>
        <div className='m-5 mx-0 p-3 border-1 border-slate-200  dark:border-slate-800 rounded-lg grid col-span-6'>
            {motherboardList.map((item)=>{
                return (
                    <>
                    
                    
                    </>
                )
            })}
            <div onClick={()=>setOpenDialg(true)}  className='cursor-pointer h-52 w-36 bg-slate-100 rounded-lg  text-slate-800  dark:bg-slate-800 justify-center flex align-middle items-center '>
            <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40}  version="1.1" x="0px" y="0px" viewBox="0 0 44 55" enable-background="new 0 0 44 44" ><g><path fill="currentColor" d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z"/></g></svg>
            </div>
        </div>
        <Dialog openDialg={openDialg} onClose={setOpenDialg(false)} />
      </div>
       

  )
}


export default MotherboardCOl