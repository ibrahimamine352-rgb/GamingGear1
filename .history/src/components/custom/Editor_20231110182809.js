import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: '' };
    this.quillRef = null;

    this.modules = {
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

    this.formats = [
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

    this.imageToolbar = [
      { label: 'Left align', value: 'left' },
      { label: 'Center align', value: 'center' },
      { label: 'Right align', value: 'right' },
    ];
  }

  handleChange = (html) => {
    this.setState({ editorHtml: html });
    console.log(html);
  };

  componentDidMount() {
    const { quill } = this.quillRef.getEditor();

    quill.root.addEventListener('contextmenu', (event) => {
      const target = quill.selection.savedRange?.end.container;

      if (target && target.tagName === 'IMG') {
        this.showImageContextMenu(event.clientX, event.clientY);
        event.preventDefault();
      }
    });

    document.addEventListener('click', () => {
      this.hideImageContextMenu();
    });
  }

  showImageContextMenu = (x, y) => {
    const imageContextMenu = document.getElementById('image-context-menu');
    if (imageContextMenu) {
      imageContextMenu.style.display = 'block';
      imageContextMenu.style.left = `${x}px`;
      imageContextMenu.style.top = `${y}px`;
    }
  };

  hideImageContextMenu = () => {
    const imageContextMenu = document.getElementById('image-context-menu');
    if (imageContextMenu) {
      imageContextMenu.style.display = 'none';
    }
  };

  handleImageAlignment = (alignment) => {
    const { quill } = this.quillRef.getEditor();
    const selectedImage = quill.selection.savedRange?.end.container;

    if (selectedImage && selectedImage.tagName === 'IMG') {
      selectedImage.style.textAlign = alignment;
    }

    this.hideImageContextMenu();
  };

  render() {
    return (
      <div>
        <ReactQuill
          ref={(el) => (this.quillRef = el)}
          theme="snow"
          onChange={this.handleChange}
          value={this.state.editorHtml}
          modules={this.modules}
          formats={this.formats}
          placeholder={this.props.placeholder}
        />
        <div id="image-context-menu" className="context-menu">
          {this.imageToolbar.map((item) => (
            <div key={item.value} onClick={() => this.handleImageAlignment(item.value)}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Editor;
