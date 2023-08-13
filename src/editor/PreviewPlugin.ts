import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, LexicalNode } from "lexical";

interface Props {
  initialHtml: string;
  onHtmlChanged: (html: string) => void;
}

const HtmlPlugin = ({ initialHtml, onHtmlChanged }: Props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
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
