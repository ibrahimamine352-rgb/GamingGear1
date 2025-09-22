import prismadb from '@/lib/prismadb'
import { Product } from '@prisma/client'
import axios from 'axios'
import React from 'react'

async function  Pctemplate () {


    const motherboards:Product[] = await (await axios.get("/api/motherboard/component")).data


  return (
     
    <div>pc-template
      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate