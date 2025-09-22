import dynamic from 'next/dynamic';
import { SetStateAction, useState } from 'react';
import BlotFormatter from 'quill-blot-formatter' 
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import axios from 'axios';
const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // eslint-disable-next-line react/display-name
    return ({ ...props }) => <RQ {...props} />;
  },
  {
    ssr: false,
  }
) as typeof ReactQuill;

const modules = {
  imageDrop: true, // Enable image drop
  imageHandler: async (image: string | Blob, callback: (arg0: any) => void) => {
    // Upload the image to Cloudinary
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzbb5kktn/image/upload',
        formData
      );

      const imageUrl = response.data.secure_url;

      // Insert the uploaded image into the editor
      callback(imageUrl);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  },
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize', 'Toolbar'],

  },
 
};

interface Props{
  value:string;
  OnUpdate: (value:String)=> void
}
export default function TextEditor({
OnUpdate,
value
}:Props) {



Quill.register('modules/imageResize', ImageResize);


  const [content, setContent] = useState('');





  return (
 <>
      <label htmlFor="title">Descption</label>
      <QuillWrapper modules={modules} placeholder='zazze' value={value} onChange={OnUpdate} theme="snow" />

      <p>{content}</p>
    </>
  )
}