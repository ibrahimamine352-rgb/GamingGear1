"use client"
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Card, CardHeader } from '@/components/ui/card'
import { CardBody, Image } from '@nextui-org/react'
import { ProdCol } from '@/types'
import prismadb from '@/lib/prismadb'
import Dialog from './dialog'
import { buildPcSelection } from './product-form'
import { useRouter } from 'next/navigation'

type motherboardpar={
motherboards:ProdCol []
selectionStaue:buildPcSelection
colname:String
onSlectionChange: (value:buildPcSelection ) => void;
}

const ProductCOl: React.FC<motherboardpar> = ({colname,motherboards,selectionStaue, onSlectionChange}) => {
    
    const [motherboardList, setOtherboardListt] = useState<ProdCol[]>([]);
    const [localselectionStaue, setLocalselectionStaue] = useState<Boolean>(true);
    
    const [localselectionMessage, setLocalselectionMessage] = useState<string>('');
    
  const router=useRouter()



    useEffect(()=>{



            const dayOfWeek = colname;
    
    switch (dayOfWeek) {

    
      case 'cpu':
     

  if(selectionStaue.motherboardIsSelected==false){
    setLocalselectionMessage('please Select Motherboard')
    setLocalselectionStaue(false)
  }else{
    setLocalselectionStaue(true)
    setLocalselectionMessage('')

  }
 
  console.log('please Select Motherboard')
        break;
    
      case 'gpu':
        if(selectionStaue.motherboardIsSelected)
        setLocalselectionStaue(true)
        break;
    
      case 'ram':
        if(selectionStaue.motherboardIsSelected)
        setLocalselectionStaue(true)
        break;
    
      case 'case':
        if(selectionStaue.motherboardIsSelected)
        setLocalselectionStaue(true)
        break;
      case 'disk':
        if(selectionStaue.motherboardIsSelected)
        setLocalselectionStaue(true)
            break;
      default:
        console.log('It\'s the weekend or an unknown day.');
    }
    router.refresh()
    },[selectionStaue])
    const [openDialg, setOpenDialg] = useState(false);
 const setOtherboardList=(par:ProdCol[])=>{
    setOtherboardListt(par)
    if(par.length>0){
        const dayOfWeek = colname;

switch (dayOfWeek) {
  case 'mb':
  
    onSlectionChange({...selectionStaue,motherboardIsSelected:true})
    break;

  case 'cpu':
    onSlectionChange({...selectionStaue,cpuIsSelected:true})
    break;

  case 'gpu':
    onSlectionChange({...selectionStaue,gpuIsSelected:true})
    break;

  case 'ram':
    onSlectionChange({...selectionStaue,ramIsSelected:true})
    break;

  case 'case':
    onSlectionChange({...selectionStaue,caseIsSelected:true})
    break;
  case 'disk':
    onSlectionChange({...selectionStaue,diskIsSelected:true})
        break;
  default:
    console.log('It\'s the weekend or an unknown day.');
}

    }else{
        const dayOfWeek = colname;

        switch (dayOfWeek) {
          case 'mb':
          
              onSlectionChange({...selectionStaue,motherboardIsSelected:false})
              break;
        
          case 'cpu':
            onSlectionChange({...selectionStaue,cpuIsSelected:false})
            break;
        
          case 'gpu':
            onSlectionChange({...selectionStaue,gpuIsSelected:false})
            break;
        
          case 'ram':
            onSlectionChange({...selectionStaue,ramIsSelected:false})
            break;
        
          case 'case':
            onSlectionChange({...selectionStaue,caseIsSelected:false})
            break;
          case 'disk':
            onSlectionChange({...selectionStaue,diskIsSelected:true})
                break;
          default:
            console.log('It\'s the weekend or an unknown day.');
        }
    }

 }
  return (
    <div className='mt-0'>

          

        <div className=' mt-1 mx-0 p-3 border-1 border-slate-200  dark:border-slate-800 rounded-lg grid grid-cols-6 gap-3 col-span-6'>
           
           
        {
                    localselectionStaue==true?<></>:<>
                    <div className='overflow-hidden'>
                    {localselectionMessage}
                    </div>
             
                    </>
                  }
            {motherboardList.map((item)=>{
                return (
                    <><div className='flex flex-col justify-between  bg-slate-100 rounded-lg  text-slate-800  dark:bg-slate-800 dark:text-slate-100'>

                    
                    <div className='w-full pb-3'>
                       {
                        item.images.length>0? <>
                         <Image src={item.images[0].url} width={'100%'} height={50} className='w-full  rounded-b-none ' />
    
                        </>  :<>
                        <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" id="Layer_1" x="0px" y="0px" width="52px" height="52px" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
<g>
	<path d="M31.5,34.5v443h449v-443H31.5z M57.5,61.5h399v316.478l-57.26-99.177L323,146.747l-76.24,132.053l-23.813,41.246   l-0.706-1.223L179.5,244.795l-42.741,74.029L98.264,385.5H57.5V61.5z"/>
	<circle cx="139" cy="133" r="40.5"/>
</g>
</svg>
                        
                        </>
                       }
                    </div>
                    <div className='text-center my-3'>
                      {item.name}   
                    </div>
                   
                    </div>
                    </>
                )
            })}
            <div onClick={()=>setOpenDialg(true)}  className='dark:text-slate-100 cursor-pointer  min-h-unit-24  min-w-36 bg-slate-100 rounded-lg  text-slate-800  dark:bg-slate-800 justify-center flex align-middle items-center '>
            <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40}  version="1.1" x="0px" y="0px" viewBox="0 0 44 55" enable-background="new 0 0 44 44" ><g><path fill="currentColor" d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z"/></g></svg>
            </div>
        </div>
        <Dialog openDialg={openDialg} onClose={setOpenDialg} prodList={motherboardList} handlechange={(e)=>setOtherboardList(e)} data={motherboards} />
      </div>
       

  )
}


export default ProductCOl