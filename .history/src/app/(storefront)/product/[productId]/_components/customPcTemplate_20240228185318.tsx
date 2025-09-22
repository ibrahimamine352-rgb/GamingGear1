import { Image, Product } from '@prisma/client'
import React from 'react'



interface Case{
    product:Product&{
        images:Image
    }
}
interface ProductFormProps{
   cases:Case[] 
}

const CustomPcTemplate : React.FC<ProductFormProps>= (cases) => {
  return (
    <div>CustomPcTemplate</div>
  )
}

export default CustomPcTemplate