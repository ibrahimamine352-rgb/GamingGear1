import dynamic from 'next/dynamic';
import { SetStateAction, useState } from 'react';
import BlotFormatter from 'quill-blot-formatter' 
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const modules = {
  
  blotFormatter: {
    moduleClass: BlotFormatter,
  },
}

export default function TextEditor() {
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
      <QuillNoSSRWrapper  className='w-full h-96' modules={modules} onChange={setContent} theme="snow" />
  
      <p>{content}</p>
    </form>
  )
}