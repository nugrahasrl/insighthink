"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Note: You'll need to install these packages:
// npm install @editorjs/editorjs @editorjs/header @editorjs/list @editorjs/paragraph @editorjs/quote @editorjs/delimiter @editorjs/image @editorjs/link

// Interface matching what's expected in your AddArticlePage component
interface EditorProps {
  data?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EditorJSComponent: React.FC<EditorProps> = ({
  data,
  onChange,
  placeholder,
  className,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import EditorJS only on the client side
    const initEditor = async () => {
      if (!editorRef.current || instanceRef.current) return;

      // Import EditorJS and its tools
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Paragraph = (await import("@editorjs/paragraph")).default;
      const Quote = (await import("@editorjs/quote")).default;
      const Delimiter = (await import("@editorjs/delimiter")).default;
      const ImageTool = (await import("@editorjs/image")).default;
      const LinkTool = (await import("@editorjs/link")).default;
      const Table = (await import("@editorjs/table")).default;
      const CodeTool = (await import("@editorjs/code")).default;

      try {
        // Parse data if it's a string
        let parsedData;
        if (data) {
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            console.error("Failed to parse editor data:", e);
            parsedData = { blocks: [] };
          }
        } else {
          parsedData = { blocks: [] };
        }

        // Initialize editor
        const editor = new EditorJS({
          holder: editorRef.current,
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
            },
            delimiter: Delimiter,
            image: {
              class: ImageTool,
              config: {
                endpoints: {
                  byFile: "/api/upload-image", // Your API endpoint for image uploads
                },
              },
            },
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: "/api/fetch-link-meta", // Your API endpoint for link metadata
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
            },
            code: CodeTool,
          },
          data: parsedData,
          placeholder: placeholder || "Start writing your article...",
          onChange: async () => {
            if (instanceRef.current) {
              const savedData = await instanceRef.current.save();
              onChange(JSON.stringify(savedData));
            }
          },
          autofocus: false,
        });

        instanceRef.current = editor;
      } catch (error) {
        console.error("EditorJS initialization error:", error);
      }
    };

    initEditor();

    // Cleanup on unmount
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={editorRef}
      className={`editorjs-wrapper ${className || "min-h-64 p-4"}`}
    />
  );
};

export default EditorJSComponent;
