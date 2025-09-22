import dynamic from 'next/dynamic';
import { SetStateAction, useState } from 'react';
import BlotFormatter from 'quill-blot-formatter' 
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
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
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  },
  imageResize: {
    //parchment: Quill.import('parchment'),
    
    modules: ['Resize', 'DisplaySize',]
  }

}

export default function TextEditor() {



Quill.register('modules/imageResize', ImageResize);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [isPublished, setIsPublished] = useState(false);

  function submitHandler(event: { preventDefault: () => void; }) {
    event.preventDefault();

    const requestObj = {
      id: new Date().toISOString(),
      title: title,
      content: content,
      isDraft: isDraft,
      isPublished: isPublished
    };

    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(requestObj),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then((data) => {
        console.log(data)
      });

  }

  function handleTitleChange(event: { preventDefault: () => void; target: { value: SetStateAction<string>; }; }) {
    event.preventDefault();
    setTitle(event.target.value);
  }

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="title">Title</label>
      <input type="text" value={title} name="title" placeholder="Enter a title" onChange={handleTitleChange} required />
      <QuillWrapper modules={modules} placeholder='zazze' value={content} onChange={setContent} theme="snow" />

      <p>{content}</p>
    </form>
  )
}