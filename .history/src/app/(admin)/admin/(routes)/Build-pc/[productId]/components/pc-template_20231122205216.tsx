import prismadb from '@/lib/prismadb'
import { Product } from '@prisma/client'
import axios from 'axios'
import React, { useState } from 'react'
import ProductCOl from './motherboard'
import { ProdCol } from '@/types'
import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'

async function  Pctemplate () {


    const motherboards:ProdCol[] = await (await axios.get("/api/motherboard/component")).data
    const [mbs,setMbs]=useState<ProdCol[]>([])
    const [selectionStatu, setSelectionStatu] = useState<buildPcSelection>(defaultValues.selectionStatu)
 
  return (
     
    <div>pc-template
       <ProductCOl motherboards={motherboards } init={mbs} selectionStaue={} colname={"mb"} updateList={function (value: ProdCol[]): void {
            setMbs(value)
          } } onSlectionChange={function (value: buildPcSelection): void {
              throw new Error('Function not implemented.')
          } } setMotherBoardId={undefined} MotherBoardId={''} lastMotherBoardId={"undefined"} />

      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate