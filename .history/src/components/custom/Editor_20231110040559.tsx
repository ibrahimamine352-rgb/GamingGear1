import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, CompositeDecorator, Entity, Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  {
    ssr: false,
  }
);

const Editorr = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState: React.SetStateAction<EditorState>) => {
    setEditorState(editorState);
  };

  useEffect(() => {
    console.log(editorState);
  }, [editorState]);

  const handlePasteImage = (e: { preventDefault: () => void; clipboardData: any; originalEvent: { clipboardData: any; }; }) => {
    e.preventDefault();
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        const src = URL.createObjectURL(blob);
  
        const editorStateWithImage = insertImage(editorState, src);
        onEditorStateChange(editorStateWithImage);
      }
    }
  };
  
  const insertImage = (editorState: EditorState, src: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: Modifier.insertText(
        contentState,
        contentState.getSelectionAfter(),
        ' ',
        undefined,
        entityKey
      ),
    });
    return newEditorState;
  };
  
const handleImageUpload = async (blob: File | null) => {
  try {
    if (!blob) {
      console.error('No image data received.');
      return;
    }

    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', 'eqq0aekw');

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dzbb5kktn/image/upload',
      formData
    );
    console.log(response);
    const imageUrl = response.data.secure_url;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageUrl });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Replace the current selection with the image entity
    const newEditorState = EditorState.push(
      editorState,
      Modifier.replaceText(contentState, editorState.getSelection(), ' ', undefined, entityKey),
      'insert-fragment'
    );

    setEditorState(newEditorState);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
  }
};

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        
      />
    </div>
  );
};

export default Editorr;

