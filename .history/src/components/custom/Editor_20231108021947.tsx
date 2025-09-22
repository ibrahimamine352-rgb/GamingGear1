"use client"

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from  'react-quill'
import 'react-quill/dist/quill.snow.css'
const Editor = () => {
    const [value,setValue]=useState('');
    
    useEffect(()=>{
       console.log(value)
    },[value])
  return (
    <div>
         
        <ReactQuill theme='snow' readOnly  value={value} onChange={setValue} />
    </div>
  )
}

export default Editor

