import { useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import {
  $getRoot,
  $getSelection,
  $insertNodes,
  $selectAll,
  LexicalNode,
  NodeSelection,
} from "lexical";
import { $createRootNode } from "lexical/nodes/LexicalRootNode";

interface Props {
  initialHtml: string;
  onHtmlChanged: (html: string) => void;
}

const HtmlPlugin = ({ initialHtml, onHtmlChanged }: Props) => {
  const [editor] = useLexicalComposerContext();

  // const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    console.log(initialHtml);
    // if (!isFirstRender) return;
    // setIsFirstRender(false);

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.getChildren().forEach((node: LexicalNode) => {
        node.remove();
      });
      $insertNodes(nodes);
    });
  }, [editor, initialHtml]);

  return null;
};

export default HtmlPlugin;
