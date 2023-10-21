"use client";

// ! cant redered the heading and list item
// TODO inspect the heading and list item problem

import { Button } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { Editor, Transforms, Element, createEditor } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import Icons from "./icons";

const initialValue = [
  {
    type: "heading-one",
    children: [{ text: "Hello" }],
  },
];

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });

  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === format,
    })
  );
  return !!match;
};

const App = () => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const [value, setValue] = useState(initialValue);

  const renderElement = useCallback((props) => {
    return <CodeElement {...props} />;
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="w-3/4 grid place-content-center">
      <Slate
        editor={editor}
        initialValue={initialValue}
        value={value}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value);
            localStorage.setItem("content", content);
          }

          setValue(value);
        }}
      >
        <div className="toolbar">
          <div className="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
            <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
              <div className="flex items-center space-x-1 sm:pr-4">
                <MarkButton format={"bold"} icon={Icons.Bold} />
                <MarkButton format={"italic"} icon={Icons.Italic} />
                <MarkButton format={"underline"} icon={Icons.Underline} />
                <MarkButton
                  format={"strikethrough"}
                  icon={Icons.Strikethrough}
                />
                <MarkButton format={"code"} icon={Icons.Code} />
              </div>
              <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                <BlockButton format={"heading-one"} icon={Icons.HeadingOne} />
                <BlockButton
                  format={"numbered-list"}
                  icon={Icons.NumberedList}
                />
                <BlockButton
                  format={"bulleted-list"}
                  icon={Icons.BulletedList}
                />
                <BlockButton format={"left"} icon={Icons.AlignLeft} />
                <BlockButton format={"center"} icon={Icons.AlignCenter} />
                <BlockButton format={"right"} icon={Icons.AlignRight} />
                <BlockButton format={"justify"} icon={Icons.AlignJustify} />
              </div>
            </div>
          </div>
        </div>
        <Editable
          placeholder="Enter your text here..."
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            if (!event.ctrlKey) {
              return;
            }

            switch (event.key) {
              case "q": {
                event.preventDefault();

                const [match] = Editor.nodes(editor, {
                  match: (n) => n.type === "code",
                });
                Transforms.setNodes(
                  editor,
                  { type: match ? "paragraph" : "code" },
                  {
                    match: (n) =>
                      Element.isElement(n) && Editor.isBlock(editor, n),
                  }
                );
                break;
              }

              case "m": {
                event.preventDefault();

                const [match] = Editor.nodes(editor, {
                  match: (n) => n.type === "heading-one",
                });
                Transforms.setNodes(
                  editor,
                  { type: match ? "paragraph" : "heading-one" },
                  {
                    match: (n) =>
                      Element.isElement(n) && Editor.isBlock(editor, n),
                  }
                );
                break;
              }

              case "b": {
                event.preventDefault();
                toggleMark(editor, "bold");
                break;
              }

              case "i": {
                event.preventDefault();
                toggleMark(editor, "italic");
                break;
              }

              case "u": {
                event.preventDefault();
                toggleMark(editor, "underline");
                break;
              }

              case "s": {
                event.preventDefault();
                toggleMark(editor, "strikethrough");
                break;
              }

              case "`": {
                event.preventDefault();
                toggleMark(editor, "code");
                break;
              }
            }
          }}
        />
        <Button className="my-2" onClick={() => console.log(value)}>
          Console Log
        </Button>
        <Button
          onClick={() => {
            const serialized = JSON.stringify(value);
            console.log(serialized);
            alert("Saving to database");
          }}
        >
          Save
        </Button>
      </Slate>
    </div>
  );
};

const CodeElement = (props) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };
  switch (element.type) {
    case "code":
      return (
        <code style={style} {...attributes}>
          {children}
        </code>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      active={isMarkActive(editor, format).toString()}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
    >
      {icon}
    </button>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      active={isBlockActive(editor, format).toString()}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
    >
      {icon}
    </button>
  );
};

export default App;
