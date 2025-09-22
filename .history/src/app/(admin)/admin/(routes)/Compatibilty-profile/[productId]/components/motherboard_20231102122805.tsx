import React from 'react'
import PropTypes from 'prop-types'
import { Product } from '@prisma/client'

type motherboardpar={
motherboards:Product
}


const motherboard: React.FC<motherboardpar> = props => {
  return (
    <div>motherboard</div>
  )
}

motherboard.propTypes = {}

export default motherboard