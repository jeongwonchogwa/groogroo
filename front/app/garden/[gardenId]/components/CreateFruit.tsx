"use client";

import MessageCreator from "@/app/components/MessageCreator";
import Button from "@/app/components/Button";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

const CreateFruit = () => {
  const router = useRouter();
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');

	const handleFruitSubmit = () => {
    console.log(`작성자: ${writer} 내용: ${content}`);
		console.log('눌리긴함?')
  };


  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row">
        <div className="w-full h-72 mr-3 ml-1">
          <MessageCreator 
						onWriterChange={setWriter}
						onContentChange={setContent}
					/>
        </div>
      </div>
      <div className="mt-7 mx-5">
        <div className="grid grid-flow-col gap-4">
          <Button color="default" label="취소하기" onClick={() => router.back()} />
          <Button
            color="primary"
            label="열매달기"
            onClick={handleFruitSubmit}
            disabled={!writer || !content}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateFruit;
