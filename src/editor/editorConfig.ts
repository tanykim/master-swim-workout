import { HeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import editorTheme from "./editorTheme";

export const editorConfig = {
  namespace: "manual",
  theme: editorTheme,
  onError(error: Error): void {
    throw error;
  },
  nodes: [HeadingNode, ListNode, ListItemNode],
};
