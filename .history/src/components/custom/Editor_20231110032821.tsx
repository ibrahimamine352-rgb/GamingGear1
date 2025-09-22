import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  {
    ssr: false,
  }
);

const Editorr = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const editorRef = useRef(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null); // Corrected typing

  useEffect(() => {
    console.log(editorState);
  }, [editorState]);

  const handleImageUpload = (file: Blob | MediaSource) => {
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: URL.createObjectURL(file) });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Insert an atomic block with the entity
    const newContentState = Modifier.insertText(
      contentState,
      contentState.getSelectionAfter(),
      ' ',
      undefined,
      entityKey
    );

    // Update the editor state with the new content state
    const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');

    setEditorState(newEditorState);
  };

  const handlePasteImage = (e: { preventDefault: () => void; clipboardData: any; originalEvent: { clipboardData: any; }; }) => {
    e.preventDefault();
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        const src = URL.createObjectURL(blob);

        const editorStateWithImage = insertImage(editorState, src);
        setEditorState(editorStateWithImage);
      }
    }
  };

  const insertImage = (editorState: EditorState, src: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Insert an atomic block with the entity
    const newContentState = Modifier.insertText(
      contentState,
      contentState.getSelectionAfter(),
      ' ',
      undefined,
      entityKey
    );

    // Update the editor state with the new content state
    const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');

    return newEditorState;
  };

  useEffect(() => {
    const handlePaste = (e: any) => {
      handlePasteImage(e);
    };

    const wrapper = wrapperRef.current;

    if (wrapper) {
      wrapper.addEventListener('paste', handlePaste);
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener('paste', handlePaste);
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
