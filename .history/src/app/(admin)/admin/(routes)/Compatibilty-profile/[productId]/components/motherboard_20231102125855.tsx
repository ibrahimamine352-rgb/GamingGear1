import React from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Card, CardHeader } from '@/components/ui/card'
import { CardBody, Image } from '@nextui-org/react'
import { ProdCol } from '@/types'

type motherboardpar={
motherboards:ProdCol []
}


const MotherboardCOl: React.FC<motherboardpar> = ({motherboards}) => {
  return (
    <div>

          
        <div className='sm:w-full md:w-96 w-96'>
            <Input type='text' placeholder='Search'/>
        </div>
        
        <div className='rounded-md border-slate-500 grid col-span-4'>
           {
           motherboards.map((prod)=>(<>
           <Image url={prod.i} />
           
           </>))
           }
        </div>

    </div>
  )
}


export default MotherboardCOl