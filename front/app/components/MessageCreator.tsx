"use client";

import WriterInput from "./WriterInput";
import ContentInput from "./ContentInput";
import React, { useState, ChangeEvent} from "react";

interface MessageCreatorProps {
  onWriterChange: (writer: string) => void;
  onContentChange: (content: string) => void;
}

const MessageCreator: React.FC<MessageCreatorProps> = ({ onWriterChange, onContentChange }) => {
  const [writer, setWriter] = useState(''); 
  const [content, setContent] = useState('');

  const handleWriterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWriter = e.target.value;
    setWriter(newWriter);
    onWriterChange(newWriter);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };
  
  return (
    <>
      <div className="nes-container is-rounded bg-white w-full h-full flex flex-col !p-4">
        <div className="w-full mt-2 flex items-center">
          <span className="font-bitBit text-2xl">From. </span>
          <WriterInput placeholder="작성자를 입력하세요" value={writer} onChange={handleWriterChange}/>
        </div>
        <div className="w-full mt-5 overflow-auto">
					<ContentInput placeholder="내용을 입력하세요" value={content} onChange={handleContentChange}/>
        </div>
      </div>
    </>
  );
};

export default MessageCreator;
