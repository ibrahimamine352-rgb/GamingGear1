import React, { useEffect } from 'react';


import 'quill/dist/quill.snow.css';
import axios from 'axios';
import { useQuill } from 'react-quilljs'; // Import useQuill directly
import BlotFormatter from 'quill-blot-formatter';
interface TextEditorProps {
  value: string;
  onValueText: (innerHTML: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onValueText }) => {
  const { quill, quillRef, Quill } = useQuill({
    modules: {
      blotFormatter: {
        moduleClass: BlotFormatter,
      },
    },
  });

  const uploadImage = async (file: string | Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'eqq0aekw');
  
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzbb5kktn/image/upload',
        formData
      );
  
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };
  
  const selectLocalImage = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
  
      try {
        if (!file) {
          console.error('No image data received.');
          return;
        }
  
        const imageUrl = await uploadImage(file);
  
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', imageUrl);
        }
      } catch (error) {
        // Handle the error, if needed
      }
    };
  };
  
  useEffect(() => {
    if (Quill && quill) {
      quill.clipboard.dangerouslyPasteHTML(value || '');
  
      const toolbar = quill.getModule('toolbar');
      if (toolbar) {
        toolbar.addHandler('image', selectLocalImage);
      }
  
      quill.on('text-change', (delta, oldDelta, source) => {
        onValueText(quill.root.innerHTML);
      });
    }
  }, [Quill, quill, onValueText, value]);
  
  return (
    <div>
      <div ref={quillRef} />
    </div>
  );
};

export default TextEditor;
