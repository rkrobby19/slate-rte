"use client";

import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Editor, Transforms, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const CustomEditor = {
  isBoldMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.bold === true : false;
  },

  isItalicMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.italic === true : false;
  },

  isUnderlineMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.underline === true : false;
  },

  isStrikethroughMarkActive(editor) {
    const marks = Editor.marks(editor);
    return marks ? marks.strikethrough === true : false;
  },

  isQuoteBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "quote",
    });

    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });

    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "bold");
    } else {
      Editor.addMark(editor, "bold", true);
    }
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "italic");
    } else {
      Editor.addMark(editor, "italic", true);
    }
  },

  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlineMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "underline");
    } else {
      Editor.addMark(editor, "underline", true);
    }
  },

  toggleStrikethroughMark(editor) {
    const isActive = CustomEditor.isStrikethroughMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "strikethrough");
    } else {
      Editor.addMark(editor, "strikethrough", true);
    }
  },

  toggleQuoteBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "quote" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

export default function Home() {
  const [editor] = useState(() => withReact(createEditor()));

  const initialValue = useMemo(
    () =>
      JSON.parse(localStorage.getItem("content")) || [
        {
          type: "paragraph",
          children: [{ text: "A line of text in a paragraph." }],
        },
      ],
    []
  );

  const renderElement = useCallback((props) => {
    // switch (props.element.type) {
    //   case "code":
    //     return <CodeElement {...props} />;
    //   case "quote":
    //     return <BlockQuoteElement {...props} />;
    //   default:
    //     return <DefaultElement {...props} />;

    switch (props.element.type) {
      case "code":
        return <CodeBlock {...props} />;
      case "quote":
        return <QuoteBlock {...props} />;
      case "ordered-list":
        return <OrderedList {...props} />;
      case "unordered-list":
        return <UnorderedList {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    let { attributes, children } = props;
    if (props.leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (props.leaf.italic) {
      children = <em>{children}</em>;
    }
    if (props.leaf.underline) {
      children = <u>{children}</u>;
    }
    if (props.leaf.strikethrough) {
      children = <del>{children}</del>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <>
      <div>Slate JS RTE</div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value);
            localStorage.setItem("content", content);
          }
        }}
      >
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
            }}
          >
            Bold
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleItalicMark(editor);
            }}
          >
            Italic
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleUnderlineMark(editor);
            }}
          >
            Underline
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleStrikethroughMark(editor);
            }}
          >
            Strike
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleQuoteBlock(editor);
            }}
          >
            Quote Block
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
          >
            Code Block
          </button>
        </div>
        <Editable
          editor={editor}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }

            switch (event.key) {
              case "`": {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }

              case "b": {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
              }

              case "i": {
                event.preventDefault();
                CustomEditor.toggleItalicMark(editor);
                break;
              }

              case "u": {
                event.preventDefault();
                CustomEditor.toggleUnderlineMark(editor);
                break;
              }

              case "s": {
                event.preventDefault();
                CustomEditor.toggleStrikethroughMark(editor);
                break;
              }

              case "q": {
                event.preventDefault();
                CustomEditor.toggleQuoteBlock(editor);
                break;
              }
            }
          }}
        />
      </Slate>
    </>
  );
}

const CodeBlock = ({ attributes, children }) => (
  <pre {...attributes}>{children}</pre>
);
const QuoteBlock = ({ attributes, children }) => (
  <blockquote {...attributes}>{children}</blockquote>
);
const OrderedList = ({ attributes, children }) => (
  <ol {...attributes}>{children}</ol>
);
const UnorderedList = ({ attributes, children }) => (
  <ul {...attributes}>{children}</ul>
);
const DefaultElement = ({ attributes, children }) => (
  <p {...attributes}>{children}</p>
);
