import { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';


Quill.register('modules/imageResize', ImageResize);

/*
 * Simple editor component that takes placeholder text as a prop
 */
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
  render() {
    return (
      <ReactQuill
        theme="snow"
        onChange={this.handleChange}
        value={this.state.editorHtml}
        modules={{
          toolbar: {
            container: toolbarOptions,
            handlers: {
              align: this.handleAlign // Handle alignment button click
            }
          }
        }}
      />
    );
  }
    // Custom handler for alignment button click
    handleAlign(value) {
      if (value === 'left' || value === 'center' || value === 'right') {
        // Apply alignment to the selected text
        const quill = this.reactQuillRef.getEditor();
        quill.format('align', value);
      }
    }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
const toolbarOptions =   [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: ['left','center'] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['link', 'image', 'video'],
    ['clean']
  ]

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
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
];

export default Editor;
