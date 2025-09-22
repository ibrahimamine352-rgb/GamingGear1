import React, { useState } from 'react'
import PropTypes from 'prop-types'

type DialogProps={openDialg:Boolean}

const Dialog: React.FC<DialogProps>  = () => {
    const [open,setOpen]=useState(open)
  return (
    <div>Dialog{open}</div>
  )
}

export default Dialog