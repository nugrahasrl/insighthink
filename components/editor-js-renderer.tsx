"use client";
import parse from "html-react-parser";

interface EditorJsRendererProps {
  data: any;
}

export default function EditorJsRenderer({ data }: EditorJsRendererProps) {
  // If data is a string (which might happen if it was JSON.stringified), try to parse it
  let editorData = data;
  if (typeof data === "string") {
    try {
      editorData = JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse editor data:", e);
      // If it's just plain text or HTML, render it directly
      return <div>{parse(data)}</div>;
    }
  }

  // If there are no blocks or blocks is not an array, return the raw data as string
  if (
    !editorData ||
    !editorData.blocks ||
    !Array.isArray(editorData.blocks) ||
    editorData.blocks.length === 0
  ) {
    if (typeof data === "string") {
      return <div>{parse(data)}</div>;
    }
    return null;
  }

  // Function to render different block types
  const renderBlock = (block: any) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={block.id} className="mb-4">
            {parse(block.data.text || "")}
          </p>
        );

      case "header":
        const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag key={block.id} className="mt-6 mb-4 font-bold">
            {parse(block.data.text || "")}
          </HeaderTag>
        );

      case "list":
        const ListTag = block.data.style === "ordered" ? "ol" : "ul";
        return (
          <ListTag key={block.id} className="mb-4 pl-6">
            {block.data.items.map((item: string, i: number) => (
              <li key={i} className="mb-1">
                {parse(item || "")}
              </li>
            ))}
          </ListTag>
        );

      case "image":
        return (
          <figure key={block.id} className="mb-6">
            <img
              src={block.data.file?.url || block.data.url}
              alt={block.data.caption || "Image"}
              className="rounded-md max-w-full"
            />
            {block.data.caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );

      case "quote":
        return (
          <blockquote
            key={block.id}
            className="border-l-4 border-primary pl-4 italic mb-4"
          >
            <p>{parse(block.data.text || "")}</p>
            {block.data.caption && (
              <cite className="text-sm text-muted-foreground">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        );

      case "delimiter":
        return <hr key={block.id} className="my-6" />;

      case "table":
        return (
          <div key={block.id} className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <tbody>
                {block.data.content.map((row: string[], i: number) => (
                  <tr key={i}>
                    {row.map((cell: string, j: number) => (
                      <td key={j} className="border p-2">
                        {parse(cell || "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "code":
        return (
          <pre
            key={block.id}
            className="bg-muted p-4 rounded-md overflow-x-auto mb-4"
          >
            <code>{block.data.code}</code>
          </pre>
        );

      default:
        return <div key={block.id}>{block.type} block not supported</div>;
    }
  };

  return (
    <div className="editor-js-renderer">
      {editorData.blocks.map(renderBlock)}
    </div>
  );
}
