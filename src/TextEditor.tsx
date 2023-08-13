import { SingleWorkoutGroup } from "./utils/types";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./editor/ToolbarPlugin";
import PreviewPlugin from "./editor/PreviewPlugin";
import CopyToClipboardPlugin from "./editor/CopyToClipboardPlugin";
import "./editor/editor.css";
import { editorConfig } from "./editor/editorConfig";
import { getHtmlString } from "./utils/converter";
import { Box } from "@chakra-ui/react";

interface Props {
  workoutGroups: SingleWorkoutGroup[];
  totalLaps: number;
  totalLapsSlowLane: number;
}

export default function TextEditor({
  workoutGroups,
  totalLaps,
  totalLapsSlowLane,
}: Props) {
  const htmlString = getHtmlString(workoutGroups, totalLaps, totalLapsSlowLane);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Box
        position="relative"
        lineHeight={1}
        textAlign="left"
        borderColor="gray.200"
        borderWidth={1}
        borderRadius={8}
        marginTop={6}
      >
        <ToolbarPlugin />
        <CopyToClipboardPlugin />
        <Box position="relative">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <PreviewPlugin
            onHtmlChanged={(html) => console.log(html)}
            initialHtml={htmlString}
          />
        </Box>
      </Box>
    </LexicalComposer>
  );
}
