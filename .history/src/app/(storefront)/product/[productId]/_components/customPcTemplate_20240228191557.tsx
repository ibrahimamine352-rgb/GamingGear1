import { Case, Cooling, Cpu, Gpu, HDD, Motherboard, Power, PreCustmizedPc, RAM } from '@/types';
import { Product } from '@prisma/client';


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
    initialData:PreCustmizedPc&Product
  }
  

const CustomPcTemplate : React.FC<ProductFormProps>= ({initialData,motherboards,gpus,cpus,cases,powersupplies,cooling,diks,rams}) => {
  
  
  
    return (
    <div>CustomPcTemplate</div>
  )
}

export default CustomPcTemplate