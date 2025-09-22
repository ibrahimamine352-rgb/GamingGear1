import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Dialog = (props: {open:Boolean}) => {
    const [open,setOpen]=useState(props.open)
  return (
    <div>Dialog{open}</div>
  )
}

Dialog.propTypes = {
    open:Boolean
}

export default Dialog