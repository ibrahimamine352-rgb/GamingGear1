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
    key:number
}
const ComponentWithCondition :React.FC<ComponentWithConditionInterface> = ({SlotList,setSlot,ramConditon,rams,key}) => {


  return (
    <div>
        {
            SlotList.map((slot)=>{
                return(<>
                {slot.products[0].name}
                <div className='border p-3 rounded-lg mb-3 border-purple-500 w-full'>
                    <div className='flex flex-col h-full justify-between'>
                        
                        <div className='w-full text-center font-bold mb-3'>Systeme de Refroidissement</div>
                        
                        <NormalCompFprRam item={slot.products[0]} cpus={rams} setItem={setSlot} key={key} />


                    </div>
                </div>
                </>)
            })
        }
    </div>
  )
}



export default ComponentWithCondition