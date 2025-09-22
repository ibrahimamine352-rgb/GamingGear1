import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';
import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats"
import './editor.css';
import axios from 'axios';
const Editor = () => {
  const { quill, quillRef, Quill } = useQuill({
    modules: { blotFormatter: {} }
  });

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register('modules/blotFormatter', BlotFormatter);
    


  }

  const selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      var file: any = input && input.files ? input.files[0] : null;
      console.log(file);
      var formData = new FormData();
      formData.append('file', file);
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
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
      }
    };
  };

  return (
    <div>
      <div ref={quillRef} />
    </div>
  );
};

export default Editor;
