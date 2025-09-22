"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// CSS is imported in globals.css (not here)

const ReactQuill = dynamic(() => import("react-quill").then(m => m.default), {
  ssr: false,
});

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
};

export default function EditorWithUseQuill({ value, onChange, placeholder, readOnly }: Props) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  return (
    <div className="w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
}
