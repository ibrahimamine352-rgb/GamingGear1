"use client"
import React, { MouseEventHandler, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Card, CardHeader } from '@/components/ui/card'
import { CardBody } from '@nextui-org/react'
import { ProdCol } from '@/types'
import prismadb from '@/lib/prismadb'
import Dialog from './dialog'
import { buildPcSelection } from './product-form'
import { useRouter } from 'next/navigation'
import usePreviewModal from '@/hooks/use-preview-modal'
import IconButton from '@/components/ui/icon-button'
import { Expand, Trash } from 'lucide-react'

import Image from "next/image";
import MbDialog from './mbDialog'
type motherboardpar={
motherboards:ProdCol []
selectionStaue:buildPcSelection
colname:String
updateList:(value:ProdCol[] ) => void;
onSlectionChange: (value:buildPcSelection ) => void;
}

const ProductCOl: React.FC<motherboardpar> = ({colname,motherboards,selectionStaue, onSlectionChange,updateList}) => {
    const previewModal = usePreviewModal();
    const [motherboardList, setOtherboardListt] = useState<ProdCol[]>([]);
    const [localselectionStaue, setLocalselectionStaue] = useState<Boolean>(true);

    const [localselectionMessage, setLocalselectionMessage] = useState<string>('');
    
  const router=useRouter()



    useEffect(()=>{



            const dayOfWeek = colname;
    
    switch (dayOfWeek) {

    
      case 'cpu':
     

  if(selectionStaue.motherboardIsSelected==false){
    setLocalselectionMessage('Please add at least one motherboard')
    setLocalselectionStaue(false)
  }else{
    setLocalselectionStaue(true)
    setLocalselectionMessage('')

  }
 

        break;
    
      case 'gpu':
        if(selectionStaue.motherboardIsSelected==false){
          setLocalselectionMessage('Please add at least one motherboard')
          setLocalselectionStaue(false)
        }else{
          setLocalselectionStaue(true)
          setLocalselectionMessage('')
      
        }
        break;
    
      case 'ram':
        if(selectionStaue.motherboardIsSelected==false){
          setLocalselectionMessage('Please add at least one motherboard')
          setLocalselectionStaue(false)
        }else{
          setLocalselectionStaue(true)
          setLocalselectionMessage('')
      
        }
        break;
    
      case 'case':
        if(selectionStaue.motherboardIsSelected==false){
          setLocalselectionMessage('Please add at least one motherboard')
          setLocalselectionStaue(false)
        }else{
          setLocalselectionStaue(true)
          setLocalselectionMessage('')
      
        }
        break;
      case 'disk':
        if(selectionStaue.motherboardIsSelected==false){
          setLocalselectionMessage('Please add at least one motherboard')
          setLocalselectionStaue(false)
        }else{
          setLocalselectionStaue(true)
          setLocalselectionMessage('')
      
        }
            break;
    case 'power':
      if(selectionStaue.motherboardIsSelected==false){
        setLocalselectionMessage('Please add at least one motherboard')
        setLocalselectionStaue(false)
      }else{
        setLocalselectionStaue(true)
        setLocalselectionMessage('')
    
      }
                    break;
      default:
        console.log('It\'s the weekend or an unknown day.');
    }
    router.refresh()
    },[selectionStaue,colname,router])
    const [openDialg, setOpenDialg] = useState(false);
 const setOtherboardList=(par:ProdCol[])=>{
    updateList(par)
    setOtherboardListt(par)
    if(motherboardList.length==0){
      onSlectionChange({...selectionStaue,motherboardIsSelected:false})
      router.refresh()
    }
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
        case 'power':
            onSlectionChange({...selectionStaue,powerIsSelected:true})
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
          
                case 'power':
            onSlectionChange({...selectionStaue,powerIsSelected:true})
                break;
          default:
            console.log('It\'s the weekend or an unknown day.');
        }
    }

 }
 const removeItem = (itemToRemove:string) => {


    // Use filter to create a new array without the item to be removed
    const updatedItems = motherboardList.filter(item => item.id !== itemToRemove);
   
    // Update the state with the new array
    setOtherboardListt(updatedItems);
  
  };
  const[IsMotherboardFilter,setIsIsMotherboardCompatible]=useState(false)
  return (
    <div className='mt-3'>

          {
            colname=="mb"?<>


<div className={' mt-1 mx-0  border-1 border-slate-200  dark:border-slate-800 rounded-lg '+(localselectionStaue==true?'bg-white dark:bg-slate-900':'dark:bg-slate-800 bg-slate-200 bg-opacity-5')}>
           
           {
                       localselectionStaue==true?<>
                       
                       
   
              <div className=' p-3 grid grid-cols-6 gap-3 col-span-6'>
              {motherboardList.map((item)=>{
                   return (
                       <><div className='flex cursor-pointer flex-col justify-between  bg-slate-100 rounded-lg  text-slate-800  dark:bg-slate-800 dark:text-slate-100'>
   
                       
                       <div className='w-full pb-3 group '>
                          {
                           item.images.length>0? <>
   
   <div className="aspect-square rounded-xl bg-gray-100 relative">
           <Image 
            src={item.images[0].url} 
             alt="" 
             fill
             className="aspect-square object-cover rounded-md rounded-b-none"
           />
           <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
             <div className="flex gap-x-6 justify-center">
               <IconButton 
                onClick={()=>removeItem(item.id)}
                 icon={<Trash size={20} className="text-gray-600" />}
               />
       
             </div>
           </div>
         </div>
   
   
   
                        
                          
                           </>  :<>
                           <div className='flex justify-center py-10 border-b-1 border-slate-200'>
                           <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" id="Layer_1" x="0px" y="0px" width="52px" height="52px" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
   <g>
       <path d="M31.5,34.5v443h449v-443H31.5z M57.5,61.5h399v316.478l-57.26-99.177L323,146.747l-76.24,132.053l-23.813,41.246   l-0.706-1.223L179.5,244.795l-42.741,74.029L98.264,385.5H57.5V61.5z"/>
       <circle cx="139" cy="133" r="40.5"/>
   </g>
   </svg>
                           </div>
                         
                           
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
               {motherboardList.length==0?
               <div onClick={()=>setOpenDialg(true)}  className='dark:text-slate-100 cursor-pointer  min-h-unit-24  min-w-36 bg-slate-100 rounded-lg  text-slate-800  dark:bg-slate-800 justify-center flex align-middle items-center '>
               <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40}  version="1.1" x="0px" y="0px" viewBox="0 0 44 55" enable-background="new 0 0 44 44" ><g><path fill="currentColor" d="M41.9,21H23V2.1c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1V21H2.1c-0.6,0-1,0.5-1,1s0.5,1,1,1H21v18.8   c0,0.6,0.5,1,1,1c0.6,0,1-0.5,1-1V23h18.8c0.6,0,1-0.5,1-1S42.5,21,41.9,21z"/></g></svg>
               </div>:<></>

               }
               
              </div>
       
               
                       </>:<>
                       <div className='flex m-11 text-center w-full justify-center '>
                       {localselectionMessage}
                       </div>
                
                       </>
                     }
   
           </div>
           <MbDialog openDialg={openDialg} onClose={setOpenDialg} prodList={motherboardList} handlechange={(e)=>setOtherboardList(e)} data={motherboards} />
       
            
            
            
            
            </>:<>
            
            
            <div className={' mt-1 mx-0  border-1 border-slate-200  dark:border-slate-800 rounded-lg '+(localselectionStaue==true?'bg-white dark:bg-slate-900':'dark:bg-slate-800 bg-slate-200 bg-opacity-5')}>
           
           {
                       localselectionStaue==true?<>
                       
                       
   
              <div className=' p-3 grid grid-cols-10 gap-3 col-span-10'>
              {motherboardList.map((item)=>{
                   return (
                       <><div className='flex cursor-pointer flex-col justify-between  bg-transparent rounded-lg  text-slate-800  dark:bg-slate-800 dark:text-slate-100'>
   
                       
                       <div className='w-full p-2 pb-3  group '>
                          {
                           item.images.length>0? <>
   
   <div className="aspect-square rounded-xl bg-gray-100 dark:bg-slate-700   relative">
           <Image 
            src={item.images[0].url} 
             alt="" 
             fill
             className="p-3  aspect-square object-cover rounded-md rounded-b-none "
           />
           <div className=" opacity-0 group-hover:opacity-100  transition absolute w-full px-3 bottom-5">
             <div className="flex gap-x-3 justify-center">
               <IconButton 
                onClick={()=>removeItem(item.id)}
                 icon={<Trash size={20} className="text-gray-600" />}
               />
       
             </div>
           </div>
         </div>
   
   
   
                        
                          
                           </>  :<>
                           <div className='flex justify-center py-10 border-b-1 border-slate-200'>
                           <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" id="Layer_1" x="0px" y="0px" width="52px" height="52px" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
   <g>
       <path d="M31.5,34.5v443h449v-443H31.5z M57.5,61.5h399v316.478l-57.26-99.177L323,146.747l-76.24,132.053l-23.813,41.246   l-0.706-1.223L179.5,244.795l-42.741,74.029L98.264,385.5H57.5V61.5z"/>
       <circle cx="139" cy="133" r="40.5"/>
   </g>
   </svg>
                           </div>
                         
                           
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
       
               
                       </>:<>
                       <div className='flex m-11 text-center w-full justify-center '>
                       {localselectionMessage}
                       </div>
                
                       </>
                     }
   
           </div>
           <Dialog openDialg={openDialg} isMotherboardCompatible={(e)=> setIsIsMotherboardCompatible(e)} ismotherboard={false} onClose={setOpenDialg} prodList={motherboardList} handlechange={(e)=>setOtherboardList(e)} data={motherboards} />
       
            
            
            </>
          }

        </div>
       

  )
}


export default ProductCOl