import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'

const Addtioanlinfos = () => {
  const [data,setData]=useState({})
  return ( 
    <div className='w-full'>
      <Button className='w-full' type='button' >+ New detail</Button>
      

    </div>
  )
}

Addtioanlinfos.propTypes = {}

export default Addtioanlinfos