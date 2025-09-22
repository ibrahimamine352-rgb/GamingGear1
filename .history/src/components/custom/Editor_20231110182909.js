import { useState, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

const Editor = () => {
  const [editorHtml, setEditorHtml] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ];

  const imageToolbar = [
    { label: 'Left align', value: 'left' },
    { label: 'Center align', value: 'center' },
    { label: 'Right align', value: 'right' },
  ];

  const handleChange = (html) => {
    setEditorHtml(html);
    console.log(html);
  };

  useEffect(() => {
    const quill = quillRef?.getEditor();
    if (quill) {
      quill.root.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('click', hideImageContextMenu);
      quill.on('text-change', (delta, oldDelta, source) => {
        // Handle text change
      });
    }

    return () => {
      const quill = quillRef?.getEditor();
      if (quill) {
        quill.root.removeEventListener('contextmenu', handleContextMenu);
      }
      document.removeEventListener('click', hideImageContextMenu);
    };
  }, [quillRef]);

  const handleContextMenu = (event) => {
    const target = event.target;
    if (target.tagName === 'IMG') {
      event.preventDefault();
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
      setSelectedImage(target);
    }
  };

  const hideImageContextMenu = () => {
    setContextMenuPosition({ x: 0, y: 0 });
    setSelectedImage(null);
  };

  const handleImageAlignment = (alignment) => {
    if (selectedImage) {
      selectedImage.style.textAlign = alignment;
      hideImageContextMenu();
    }
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        onChange={handleChange}
        value={editorHtml}
        modules={modules}
        formats={formats}
        placeholder="Type something..."
      />
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            display: 'block',
            zIndex: 1000,
          }}
          className="context-menu"
        >
          {imageToolbar.map((item) => (
            <div key={item.value} onClick={() => handleImageAlignment(item.value)}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Editor;
