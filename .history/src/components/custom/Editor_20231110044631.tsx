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

  const onEditorStateChange = (editorState: React.SetStateAction<EditorState>) => {
    setEditorState(editorState);
  };

  useEffect(() => {
    console.log(editorState);
  }, [editorState]);

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
      const editorStateWithImage = insertImage(editorState, imageUrl);
      setEditorState(editorStateWithImage);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  };

  const handlePasteImage = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = (e.clipboardData || e.nativeEvent.clipboardData).items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        if (blob) {
          const src = URL.createObjectURL(blob);
          const editorStateWithImage = insertImage(editorState, src);
          onEditorStateChange(editorStateWithImage);
        }

      }
    }
  };

  const insertImage = (editorState: EditorState, src: string) => {
    console.log(src);
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

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: handleImageUpload,
            alt: { present: true, mandatory: true },
            urlEnabled:true,
            uploadEnabled:true, inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
          },
        }}
      />
    </div>
  );
};

export default Editorr;
