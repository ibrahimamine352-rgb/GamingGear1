import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'

type Field = {
  name: string; // Use 'string' for string values
  value: string; // Use 'string' for string values
};

const Addtioanlinfos = () => {
  const [data,setData]=useState<Field[]>([])
  return ( 
    <div className='w-full'>
      <Button className='w-full' type='button' >+ New detail</Button>


    </div>
  )
}

Addtioanlinfos.propTypes = {}

export default Addtioanlinfos