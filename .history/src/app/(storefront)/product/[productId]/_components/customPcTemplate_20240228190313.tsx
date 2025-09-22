import { Case, Cooling, Cpu, Gpu, HDD, Motherboard, Power, PreCustmizedPc, RAM } from '@/types';


import React from 'react'


  interface ProductFormProps {
    cases: Case[];
    cooling: Cooling[];
    cpus: Cpu[];
    diks: HDD[];
    gpus: Gpu[];
    motherboards: Motherboard[];
    powersupplies: Power[];
    rams: RAM[];
    initialData:PreCustmizedPc
  }
  

const CustomPcTemplate : React.FC<ProductFormProps>= (cases) => {
  return (
    <div>CustomPcTemplate</div>
  )
}

export default CustomPcTemplate