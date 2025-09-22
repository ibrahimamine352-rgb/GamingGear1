import React, { useEffect } from "react";

const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css"; // Add css for snow theme

export default function IndexPage() {
  const { quill, quillRef } = useQuill();
  console.log("!");
  useEffect(() => {
    // console.log(quill, quillRef);
    console.log("!");
    if (quill) quill.setText("123");
  });

  return (
    <div style={{ width: "600px", height: "300px" }}>
      <div ref={quillRef} />
    </div>
  );
}
