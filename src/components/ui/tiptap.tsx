// EditorWithToolbar.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";

type Props = {
  valueHtml: string;
  onChange: (html: string) => void;
  onSave?: (html: string) => Promise<void> | void;
};

export default function EditorWithToolbar({
  valueHtml,
  onChange,
  onSave,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false, // Add this line to fix SSR error
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: valueHtml || "<p></p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Add loading check
  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="bg-background rounded-[10px] border border-stroke-border">
      <div className="mb-3">
        <div className="flex flex-wrap gap-2 items-center">
          {/* style / headings */}
          <select
            value={
              editor?.isActive("heading", { level: 1 })
                ? "h1"
                : editor?.isActive("heading", { level: 2 })
                ? "h2"
                : editor?.isActive("heading", { level: 3 })
                ? "h3"
                : "p"
            }
            onChange={(e) => {
              const v = e.target.value;
              if (!editor) return;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: Number(v.replace("h", "")) as 1 | 2 | 3,
                  })
                  .run();
            }}
            className=" px-2 py-1 rounded"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          {/* Bold, Italic, Underline, Strike */}
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("bold") ? "bg-gray-200" : ""
            }`}
          >
            B
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("italic") ? "bg-gray-200" : ""
            }`}
          >
            I
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("underline") ? "bg-gray-200" : ""
            }`}
          >
            U
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("strike") ? "bg-gray-200" : ""
            }`}
          >
            S
          </button>

          {/* Lists */}
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
          >
            • List
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
          >
            1. List
          </button>

          {/* Blockquote / Codeblock */}
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("blockquote") ? "bg-gray-200" : ""
            }`}
          >
            ❝ Block
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={`px-2 py-1 rounded ${
              editor?.isActive("codeBlock") ? "bg-gray-200" : ""
            }`}
          >
            {"</> Code"}
          </button>

          {/* Text align */}
          <button
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            className="px-2 py-1 rounded"
          >
            Left
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            className="px-2 py-1 rounded"
          >
            Center
          </button>
          <button
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            className="px-2 py-1 rounded"
          >
            Right
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().setTextAlign("justify").run()
            }
            className="px-2 py-1 rounded"
          >
            Justify
          </button>

          {/* Link */}

          {/* Color picker (simple) */}
          <input
            type="color"
            onChange={(e) => {
              editor?.chain().focus().setColor(e.target.value).run();
            }}
            title="Text color"
            className="w-8 h-8 p-0 rounded"
          />

          {/* Undo / Redo */}
          <button
            onClick={() => editor?.chain().focus().undo().run()}
            className="px-2 py-1 rounded"
          >
            Undo
          </button>
          <button
            onClick={() => editor?.chain().focus().redo().run()}
            className="px-2 py-1 rounded"
          >
            Redo
          </button>

          {/* Save */}
          <button
            onClick={() => {
              const html = editor?.getHTML() || "";
              if (onSave) onSave(html);
            }}
            className="ml-3 px-3 py-1 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="min-h-[300px] p-3 bg-white rounded overflow-y-auto prose max-w-none">
        <EditorContent editor={editor} />
       
      </div>
    </div>
  );
}
