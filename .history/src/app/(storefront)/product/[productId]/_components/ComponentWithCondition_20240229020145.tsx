import React, { useState } from 'react'
import { RamConditon } from './customPcTemplate'
import { RAM } from '@/types'
import NormalComp from './NormalComp'
import NormalCompFprRam from './NormalCompForRam'


interface ComponentWithConditionInterface{
    ramConditon:RamConditon
    rams:RAM[],
    SlotList:RAM[],
    setSlot:(r:RAM,key:number)=>void
}
const ComponentWithCondition :React.FC<ComponentWithConditionInterface> = ({SlotList,setSlot,ramConditon,rams}) => {


  return (
    <>
        {
            SlotList.map((slot,key)=>{
                return(<>
    
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Ram {key+1}</div>
                        
                        <NormalCompFprRam item={slot.products[0]} cpus={rams} setItem={setSlot} key={key} />


                    </div>
                </div>
                </>)
            })
        }
    </>
  )
}



export default ComponentWithCondition