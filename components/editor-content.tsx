"use client";
import type { JSX } from "react/jsx-runtime";

interface EditorContentProps {
  data: any;
}

export default function EditorContent({ data }: EditorContentProps) {
  if (!data || !data.blocks || data.blocks.length === 0) {
    return null;
  }

  return (
    <div className="prose max-w-none dark:prose-invert">
      {data.blocks.map((block: any, index: number) => {
        switch (block.type) {
          case "header":
            const HeadingTag =
              `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return <HeadingTag key={index}>{block.data.text}</HeadingTag>;

          case "paragraph":
            return (
              <p
                key={index}
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );

          case "list":
            const ListTag = block.data.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag key={index}>
                {block.data.items.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );

          case "image":
            return (
              <figure key={index} className="my-4">
                <img
                  src={block.data.file?.url || "/placeholder.svg"}
                  alt={block.data.caption || ""}
                  className="max-w-full rounded-lg"
                />
                {block.data.caption && (
                  <figcaption className="text-center text-sm text-gray-500 mt-2">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote key={index} className="border-l-4 pl-4 italic">
                <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                {block.data.caption && <cite>— {block.data.caption}</cite>}
              </blockquote>
            );

          case "code":
            return (
              <pre
                key={index}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto"
              >
                <code>{block.data.code}</code>
              </pre>
            );

          case "table":
            return (
              <div key={index} className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    {block.data.content.map(
                      (row: string[], rowIndex: number) => (
                        <tr key={rowIndex}>
                          {row.map((cell: string, cellIndex: number) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap"
                              dangerouslySetInnerHTML={{ __html: cell }}
                            />
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
