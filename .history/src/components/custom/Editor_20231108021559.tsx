"use client"

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from  'react-quill'
import 'react-quill/dist/quill.snow.css'
const Editor = () => {
    const [value,setValue]=useState('');
  return (
    <div>
         
        <ReactQuill theme='snow' value={value} onChange={setValue} />
    </div>
  )
}

export default Editor

