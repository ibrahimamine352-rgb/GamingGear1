import React from 'react'
import { RamConditon } from './customPcTemplate'


interface ComponentWithConditionInterface{
    ramConditon:RamConditon
}
const ComponentWithCondition :React.FC<ComponentWithConditionInterface> = () => {
  return (
    <div>ComponentWithCondition</div>
  )
}



export default ComponentWithCondition