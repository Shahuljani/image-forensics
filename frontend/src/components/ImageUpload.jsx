import React, { useRef } from "react";

export default function ImageUpload({ onUpload }){
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
      <div className="mb-3">📁 Upload Image</div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} />
      <button onClick={() => inputRef.current.click()} className="mt-3 px-4 py-2 rounded bg-indigo-600 text-white">Choose File</button>
    </div>
  );
}
