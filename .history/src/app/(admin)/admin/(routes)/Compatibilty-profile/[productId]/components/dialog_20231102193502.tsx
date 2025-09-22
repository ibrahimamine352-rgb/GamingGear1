import React, { useState } from 'react'
import PropTypes from 'prop-types'

type DialogProps={openDialg:Boolean}

const Dialog: React.FC<DialogProps>  = ({openDialg}) => {
    const [open,setOpen]=useState(openDialg)
  return (
    <div>
        {open?<>Dialog</>:<></>}
        
        
        </div>
  )
}

export default Dialog