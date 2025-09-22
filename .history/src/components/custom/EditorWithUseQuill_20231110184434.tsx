import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
import Quill from 'quill';

interface TextEditorProps {
  value: string;
  onValueText: (innerHTML: string) => void;
}

export default function TextEditor({
  value,
  onValueText,
}: TextEditorProps) {
  const { quill, quillRef, Quill } = useQuill({
    modules: {
      blotFormatter: {
        moduleClass: BlotFormatter,
      },
    },
  });

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

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'eqq0aekw');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dzbb5kktn/image/upload',
          formData
        );

        const imageUrl = response.data.secure_url;

        if (quill) {
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', imageUrl);
        }
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
      }
    };
  };

  useEffect(() => {
    if (Quill && quill) {
      Quill.register('modules/blotFormatter', BlotFormatter);
   
      quill.clipboard.dangerouslyPasteHTML(value || '');
      quill.getModule('toolbar').addHandler('image', selectLocalImage);
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
}
