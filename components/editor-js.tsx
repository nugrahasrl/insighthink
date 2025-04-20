"use client"

import { useEffect, useRef, useState } from "react"
// @ts-ignore
import EditorJS from "@editorjs/editorjs"
// @ts-ignore
import Header from "@editorjs/header"
// @ts-ignore
import List from "@editorjs/list"
// @ts-ignore
import Paragraph from "@editorjs/paragraph"
// @ts-ignore
import Image from "@editorjs/image"
// @ts-ignore
import Link from "@editorjs/link"
// @ts-ignore
import Checklist from "@editorjs/checklist"
// @ts-ignore
import Quote from "@editorjs/quote"
// @ts-ignore
import CodeTool from "@editorjs/code"
// @ts-ignore
import Marker from "@editorjs/marker"
// @ts-ignore
import Table from "@editorjs/table"

interface EditorProps {
  data?: any
  onChange?: (data: any) => void
  placeholder?: string
  readOnly?: boolean
}

export default function TextEditor({
  data,
  onChange,
  placeholder = "Start writing...",
  readOnly = false,
}: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null)
  const [editorReady, setEditorReady] = useState(false)
  const holderId = useRef(`editorjs-${Math.floor(Math.random() * 10000)}`).current

  // Initialize editor
  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: holderId,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile(file: File) {
                  // Replace with your image upload logic
                  return Promise.resolve({
                    success: 1,
                    file: {
                      url: URL.createObjectURL(file),
                    },
                  })
                },
              },
            },
          },
          link: {
            class: Link,
            inlineToolbar: true,
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          code: CodeTool,
          marker: Marker,
          table: {
            class: Table,
            inlineToolbar: true,
          },
        },
        data: data || {},
        placeholder,
        readOnly,
        onChange: async () => {
          if (onChange) {
            const savedData = await editorRef.current?.save()
            onChange(savedData)
          }
        },
      })

      editorRef.current = editor

      editor.isReady.then(() => {
        setEditorReady(true)
      })
    }

    return () => {
      if (editorRef.current && editorReady) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [])

  // Update editor data when props change
  useEffect(() => {
    if (editorRef.current && editorReady && data) {
      editorRef.current.render(data)
    }
  }, [data, editorReady])

  return (
    <div className="w-full">
      <div id={holderId} className="prose max-w-none dark:prose-invert border rounded-md min-h-[200px]"></div>
    </div>
  )
}
