import { Case, Cooling, Cpu, Gpu, HDD, Motherboard, Power, PreCustmizedPc, Prod, RAM } from '@/types';
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
    initialData:PreCustmizedPc&Prod
  }
  

const CustomPcTemplate : React.FC<ProductFormProps>= ({initialData,motherboards,gpus,cpus,cases,powersupplies,cooling,diks,rams}) => {
  
    const formattedproduct = {
        id: initialData?.id,
        name: initialData?.name,
        images: initialData?.images,
        dicountPrice:parseFloat(initialData.dicountPrice.toString()),
        stock: parseInt(initialData.stock.toString()),
        price: parseFloat(initialData?.price?.toString()),
        description: initialData.description,
      }
    
    

  
    return (
    <div>CustomPcTemplate</div>
  )
}

export default CustomPcTemplate