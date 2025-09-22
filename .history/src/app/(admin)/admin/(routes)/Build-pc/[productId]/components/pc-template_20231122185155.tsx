import prismadb from '@/lib/prismadb'
import React from 'react'

async function  Pctemplate () {


    const motherboards = await prismadb.product.findMany({
        where: {
          motherboard: {
            some: {},
          },
        },
        include: {
          motherboard: true,
          images:true,
    
        },
      });


  return (
     
    <div>pc-template

        
    </div>
  )
}

export default Pctemplate