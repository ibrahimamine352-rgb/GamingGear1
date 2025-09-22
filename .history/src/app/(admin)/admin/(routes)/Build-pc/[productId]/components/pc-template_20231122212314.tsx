"use client"
import prismadb from '@/lib/prismadb'
import { Product } from '@prisma/client'
import axios from 'axios'
import React, { useState } from 'react'
import ProductCOl from './motherboard'

import { buildPcSelection } from '../../../Compatibilty-profile/[productId]/components/product-form'
import { ProdCol } from '@/types'

const Pctemplate: React.FC = async () => {


    const motherboards:ProdCol[] =  await axios.get("/api/motherboard/component").then((v )=>{
        return v.data
    })

    const [mot,setMot]=useState<ProdCol[]>([])
 
  return (
     
    <div>pc-template
       <ProductCOl motherboards={motherboards} init={[]} colname={"mb"} updateList={function (value: ProdCol[]): void {
        setMot(value)
          } } setMotherBoardId={undefined} MotherBoardId={''} lastMotherBoardId={"undefined"} selectionStaue={{
              motherboardIsSelected: false,
              cpuIsSelected: false,
              gpuIsSelected: false,
              ramIsSelected: false,
              caseIsSelected: false,
              diskIsSelected: false,
              powerIsSelected: false
          }} onSlectionChange={function (value: buildPcSelection): void {
             
          } } />

      {motherboards.map((i)=><>
      {i.id}
      </>)}

    </div>
  )
}

export default Pctemplate