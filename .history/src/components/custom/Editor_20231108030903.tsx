"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Editor
const Editorr = () => {
    const [value,setValue]=useState('');
    
    useEffect(()=>{
       console.log(value)
    },[value])
  return (
    <div>
         
        
    </div>
  )
}

export default Editorr

