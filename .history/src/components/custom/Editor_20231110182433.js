import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorHtml: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(html) {
    this.setState({ editorHtml: html });
    console.log(html);
  }

  handleImageAlignment = (value) => {
    const { quill } = this.quillRef.getEditor();
    const selectedImage = quill.getSelection();
    if (selectedImage) {
      const image = quill.scroll.descendant(Quill.Embed, selectedImage.index);
      if (image && image.domNode.tagName === 'IMG') {
        image.domNode.style.textAlign = value;
      }
    }
  };

  render() {
    return (
      <ReactQuill
        ref={(el) => (this.quillRef = el)}
        theme={this.state.theme}
        onChange={this.handleChange}
        value={this.state.editorHtml}
        modules={{
          toolbar: {
            container: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ size: [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
              ['link', 'image', 'video'],
              [{ align: [] }], // Text alignment
              ['clean'],
              [{ alignImage: [] }], // Image alignment
            ],
            handlers: {
              alignImage: this.handleImageAlignment,
            },
          },
          clipboard: {
            matchVisual: false,
          },
          imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize'],
          },
        }}
        formats={[
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
          'align',
        ]}
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default Editor;
