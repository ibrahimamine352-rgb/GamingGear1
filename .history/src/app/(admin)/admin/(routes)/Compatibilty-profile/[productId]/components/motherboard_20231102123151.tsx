import React from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'
import { Input } from '@/components/ui/input'

type motherboardpar={
motherboards:Product []
}


const MotherboardCOl: React.FC<motherboardpar> = ({motherboards}) => {
  return (
    <div>
        <div className='sm:w-full md:w-96 w-96'>
            <Input type='text' placeholder='Search'/>
        </div>


    </div>
  )
}


export default MotherboardCOl