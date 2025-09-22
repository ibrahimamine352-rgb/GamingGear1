import React from 'react'
import PropTypes from 'prop-types'

const Dialog = (props: {open:Boolean}) => {
  return (
    <div>Dialog{props.open.valueOf()}</div>
  )
}

Dialog.propTypes = {
    open:Boolean
}

export default Dialog