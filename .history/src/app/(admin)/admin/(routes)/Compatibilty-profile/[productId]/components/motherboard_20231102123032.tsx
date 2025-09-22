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
        <div>
            <Input type='text' placeholder='Search'/>
        </div>


    </div>
  )
}


export default MotherboardCOl