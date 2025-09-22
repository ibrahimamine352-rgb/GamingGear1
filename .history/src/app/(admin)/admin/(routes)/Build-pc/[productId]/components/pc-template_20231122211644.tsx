"use client"
import prismadb from '@/lib/prismadb'
import { Product } from '@prisma/client'
import axios from 'axios'
import React, { useState } from 'react'
import ProductCOl from './motherboard'

import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'

const Pctemplate: React.FC = async () => {


    const motherboards:ProdCol[] = await (await axios.get("/api/motherboard/component")).data
  
  
 
  return (
     
    <div>pc-template
       <ProductCOl motherboards={motherboards } init={[]}  colname={"mb"} updateList={function (value: ProdCol[]): void {
         
          } }  setMotherBoardId={undefined} MotherBoardId={''} lastMotherBoardId={"undefined"} />

      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate