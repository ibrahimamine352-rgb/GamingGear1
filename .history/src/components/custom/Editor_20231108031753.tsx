
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js'; 

const Editor=dynamic(
    ()=>import("react-draft-wysiwyg").then((module)=>module.Editor),{
        ssr:false,
    }
)


const Editorr = () => {
    const [editorState,setEditorState]=useState(EditorState.createEmpty());
    const onEditorStateChange=(editorState:any)=>{
        setEditorState(editorState)
    }
    useEffect(()=>{
       console.log(editorState)
    },[editorState])
  return (
    <div>
         <Editor
  editorState={editorState}

  onEditorStateChange={onEditorStateChange}
/>;
        
    </div>
  )
}

export default Editorr

