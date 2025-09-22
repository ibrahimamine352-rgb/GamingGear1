import React from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'

type motherboardpar={
motherboards:Product
}


const Motherboard: React.FC<motherboardpar> = ({motherboards}) => {
  return (
    <div>motherboard</div>
  )
}


export default Motherboard