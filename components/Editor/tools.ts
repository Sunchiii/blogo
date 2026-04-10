// This file is imported dynamically inside useEffect — never at module level
// to avoid SSR issues with Editor.js accessing window/document

import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";

// Base64 image uploader — stores images as data URLs in IndexedDB
function uploadByFile(file: File) {
  return new Promise<{ success: number; file: { url: string } }>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ success: 1, file: { url: reader.result as string } });
    };
    reader.readAsDataURL(file);
  });
}

export const EDITOR_TOOLS = {
  header: {
    class: Header,
    config: { levels: [1, 2, 3, 4], defaultLevel: 2 },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  code: {
    class: Code,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  inlineCode: {
    class: InlineCode,
  },
  linkTool: {
    class: LinkTool,
  },
  image: {
    class: ImageTool,
    config: {
      uploader: { uploadByFile },
    },
  },
};
