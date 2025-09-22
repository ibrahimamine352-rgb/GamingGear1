import prismadb from '@/lib/prismadb'
import { Product } from '@prisma/client'
import axios from 'axios'
import React, { useState } from 'react'
import ProductCOl from './motherboard'

import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'

async function  Pctemplate () {


    const motherboards:ProdCol[] = await (await axios.get("/api/motherboard/component")).data
    const [mbs,setMbs]=useState<ProdCol[]>([])
    const [selectionStatu, setSelectionStatu] = useState<buildPcSelection>({
        motherboardIsSelected: false,
        cpuIsSelected: false,
        gpuIsSelected: false,
        ramIsSelected: false,
        caseIsSelected: false,
        diskIsSelected: false,
        powerIsSelected: false
    })
 
  return (
     
    <div>pc-template
       <ProductCOl motherboards={motherboards } init={mbs} selectionStaue={selectionStatu} colname={"mb"} updateList={function (value: ProdCol[]): void {
            setMbs(value)
          } } onSlectionChange={setSelectionStatu} setMotherBoardId={undefined} MotherBoardId={''} lastMotherBoardId={"undefined"} />

      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate