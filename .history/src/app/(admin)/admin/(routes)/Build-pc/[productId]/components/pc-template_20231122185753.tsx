import prismadb from '@/lib/prismadb'
import axios from 'axios'
import React from 'react'

async function  Pctemplate () {


    const motherboards = await axios.get("/api/motherboard/component")


  return (
     
    <div>pc-template
      {motherboards.data}

    </div>
  )
}

export default Pctemplate