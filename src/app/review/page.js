"use client";
import React, { useCallback, useState } from "react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

function page() {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  let initialValue = JSON.parse(localStorage.getItem("content"));

  if (!initialValue) {
    initialValue = [
      {
        type: "heading-one",
        children: [{ text: "Hello" }],
      },
      {
        type: "paragraph",
        children: [{ text: "This is a review page" }],
      },
    ];
  }

  const renderElement = useCallback((props) => {
    return <CodeElement {...props} />;
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="w-3/4 grid place-content-center">
      <h1>Review page</h1>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          readOnly
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        ></Editable>
      </Slate>
    </div>
  );
}

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

export default page;
