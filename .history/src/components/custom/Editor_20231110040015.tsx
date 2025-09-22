import React, { useEffect, useState, useRef } from 'react';
import { EditorState, Modifier, Editor as DraftEditor } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from 'axios';

// If you can import 'Editor' directly, you might not need dynamic import.
import { Editor } from 'react-draft-wysiwyg';

const Editorr = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(editorState);
  }, [editorState]);

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

      const imageUrl = response.data.secure_url;

      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageUrl });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      // Insert the image entity
      const newContentState = Modifier.replaceText(contentState, editorState.getSelection(), ' ', undefined, entityKey);

      // Update the editor state with the new content state
      const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');

      setEditorState(newEditorState);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const items = (e.clipboardData || (e as any).originalEvent.clipboardData).items;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile();
          await handleImageUpload(blob);
        }
      }
    };

    if (wrapper) {
      wrapper.addEventListener('paste', handlePaste as any);
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener('paste', handlePaste as any);
      }
    };
  }, [handleImageUpload]);

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
