"use client"
import prismadb from '@/lib/prismadb'
import { Product } from '@prisma/client'
import axios from 'axios'
import React, { useState } from 'react'
import ProductCOl from './motherboard'

import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'

const Pctemplate: React.FC = async () => {

    const [selectionStatu, setSelectionStatu] = useState<buildPcSelection>({
        motherboardIsSelected: false,
        cpuIsSelected: false,
        gpuIsSelected: false,
        ramIsSelected: false,
        caseIsSelected: false,
        diskIsSelected: false,
        powerIsSelected: false
    })
    const motherboards:ProdCol[] = await (await axios.get("/api/motherboard/component")).data
  
  
 
  return (
     
    <div>pc-template
       <ProductCOl motherboards={motherboards } init={[]} selectionStaue={selectionStatu} colname={"mb"} updateList={function (value: ProdCol[]): void {
         
          } } onSlectionChange={setSelectionStatu} setMotherBoardId={undefined} MotherBoardId={''} lastMotherBoardId={"undefined"} />

      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate