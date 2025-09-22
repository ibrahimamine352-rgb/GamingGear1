import React, { useEffect, useState } from 'react';
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

const Editorr = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    console.log(editorState);
  }, [editorState]);

  const onEditorStateChange = (newEditorState: React.SetStateAction<EditorState>) => {
    setEditorState(newEditorState);
  };

  const insertImage = (blob: Blob | MediaSource) => {
    const src = URL.createObjectURL(blob);
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.insertText(
      contentState,
      contentState.getSelectionAfter(),
      ' ',
      undefined,
      entityKey
    );
    return EditorState.push(editorState, newContentState, 'insert-fragment');
  };

  const handlePasteImage = (e: { preventDefault: () => void; clipboardData: any; originalEvent: { clipboardData: any; }; }) => {
    e.preventDefault();
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        const editorStateWithImage = insertImage(blob);
        onEditorStateChange(editorStateWithImage);
      }
    }
  };

  const handleImageUpload = async (blob: string | Blob) => {
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
      const editorStateWithImage = insertImage(imageUrl);
      setEditorState(editorStateWithImage);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  };

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        editorRef={handlePasteImage}

      />
    </div>
  );
};

export default Editorr;
