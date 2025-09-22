

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';
import { ContentState } from 'react-draft-wysiwyg';
import './editor.css'
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

  const handleImageUpload = async (blob: string | Blob| null) => {
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

    

      const imageUrl = response.data.secure_url;
      return new Promise((resolve, reject) => {
        resolve({ data: { link: imageUrl } });
      });
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

  const insertImage = (editorState: EditorState, src: string): EditorState => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    // Create an entity with the image source
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  
    // Get the updated content state
    const newContentState = Modifier.replaceText(
      contentState,
      selectionState,
      ' ', // You might want to insert something more meaningful here
      undefined,
      entityKey
    ) as ContentState;
  
    // Update the editor state with the new content state
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-fragment'
    );
  
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
            alt: { present: false, mandatory: false },
            urlEnabled:true,
            previewImage: true,
            uploadEnabled:true, inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
          },

          inline: {
            inDropdown: false,
            className: "test",
            component: undefined,
            dropdownClassName: undefined,
            options: ["bold", "italic", "underline"],
            bold: { className: "test", style: { color: "red" } },
            italic: { className: undefined },
            underline: { className: undefined },
          },
        }}

      />
    </div>
  );
};

export default Editorr;
