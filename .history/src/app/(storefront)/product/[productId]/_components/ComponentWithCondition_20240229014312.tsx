import React, { useState } from 'react'
import { RamConditon } from './customPcTemplate'
import { RAM } from '@/types'


interface ComponentWithConditionInterface{
    ramConditon:RamConditon
    rams:RAM[],
    SlotList:RAM[],
    setSlotList:(r:RAM[])=>void
}
const ComponentWithCondition :React.FC<ComponentWithConditionInterface> = ({SlotList,setSlotList,ramConditon,rams}) => {


  return (
    <div>
        {
            SlotList.map((slot)=>{
                return(<>
                {slot.products[0].name}
                
                </>)
            })
        }
    </div>
  )
}



export default ComponentWithCondition