import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  {
    ssr: false,
  }
);

const handlePasteImage = async (e: React.ClipboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const items = e.clipboardData.items;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') === 0) {
      const blob = item.getAsFile();
      handleImageUpload(blob);
    }
  }
};

const Editorr = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(editorState);
  }, [editorState]);

  const handleImageUpload = async (file: string | Blob) => {
    try {
      // ... (your existing image upload logic)
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  };
  useEffect(() => {
    const wrapper = wrapperRef.current;
  
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
      handlePasteImage(e);
    };
  
    if (wrapper) {
      // Use type assertion here
      wrapper.addEventListener('paste', handlePaste as unknown as EventListener);
    }
  
    return () => {
      if (wrapper) {
        // Use type assertion here as well
        wrapper.removeEventListener('paste', handlePaste as unknown as EventListener);
      }
    };
  }, [handlePasteImage]);
  return (
    <div ref={wrapperRef}>
      <Editor
        editorState={editorState}
        onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
        toolbar={{
          image: {
            uploadCallback: handleImageUpload,
            alt: { present: true, mandatory: true },
          },
        }}
      />
    </div>
  );
};

export default Editorr;
function handleImageUpload(blob: File | null) {
  throw new Error('Function not implemented.');
}

