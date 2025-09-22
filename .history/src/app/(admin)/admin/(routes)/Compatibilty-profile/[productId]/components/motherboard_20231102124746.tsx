import React from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { Card, CardHeader } from '@/components/ui/card'
import { CardBody } from '@nextui-org/react'

type motherboardpar={
motherboards:Product []
}


const MotherboardCOl: React.FC<motherboardpar> = ({motherboards}) => {
  return (
    <div>

          
        <div className='sm:w-full md:w-96 w-96'>
            <Input type='text' placeholder='Search'/>
        </div>
        
        <div className='rounded-md '>

        </div>

    </div>
  )
}


export default MotherboardCOl