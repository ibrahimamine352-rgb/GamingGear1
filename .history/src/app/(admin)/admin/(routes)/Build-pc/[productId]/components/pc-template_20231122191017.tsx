import prismadb from '@/lib/prismadb'
import { Product } from '@prisma/client'
import axios from 'axios'
import React from 'react'
import ProductCOl from './motherboard'
import { ProdCol } from '@/types'
import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'

async function  Pctemplate () {


    const motherboards:ProdCol[] = await (await axios.get("/api/motherboard/component")).data


  return (
     
    <div>pc-template
       <ProductCOl motherboards={motherboards } init={[]} selectionStaue={{
              motherboardIsSelected: false,
              cpuIsSelected: false,
              gpuIsSelected: false,
              ramIsSelected: false,
              caseIsSelected: false,
              diskIsSelected: false,
              powerIsSelected: false
          }} colname={"mb"} updateList={function (value: ProdCol[]): void {
              throw new Error('Function not implemented.')
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