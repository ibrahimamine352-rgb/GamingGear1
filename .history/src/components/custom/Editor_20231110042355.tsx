import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, CompositeDecorator, Entity, Modifier } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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

  const handleImageUpload = (file:any) => {
    // You should implement your own image upload logic here.
    // This example simply adds a placeholder for the uploaded image.
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
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-fragment'
    );

    onEditorStateChange(newEditorState);
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
  
  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: handleImageUpload,
            alt: { present: true, mandatory: true },
          },insertImage,
        }
        
        }
        
      />
    </div>
  );
};

export default Editorr;
