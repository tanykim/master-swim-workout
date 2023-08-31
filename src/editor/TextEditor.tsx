import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./ToolbarPlugin";
import PreviewPlugin from "./PreviewPlugin";
import CopyToClipboardPlugin from "./CopyToClipboardPlugin";
import { editorConfig } from "./editorConfig";
import {
  getCombinedHtmlString,
  getGroupedHtmlString,
} from "../utils/converter";
import {
  Box,
  Radio,
  RadioGroup,
  HStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { usePractice } from "../utils/PracticeContext";
import "./editor.css";

export type DisplayType = "separate" | "combined";

const displayTypes: { value: DisplayType; label: string }[] = [
  { value: "separate", label: "Show lanes separately by speed" },
  {
    value: "combined",
    label: "Show combined like (medium lanes / slow lanes)",
  },
];

export default function TextEditor() {
  const practice = usePractice();

  const hasMedium =
    practice.filter(
      (group) =>
        group.workoutList.filter((workout) => workout.altM != null).length > 0
    ).length > 0;

  const hasSlow =
    practice.filter(
      (group) =>
        group.workoutList.filter((workout) => workout.alt != null).length > 0
    ).length > 0;

  const [displayHtml, setDisplayHtml] = useState<DisplayType>("separate");

  const htmlString =
    displayHtml === "combined"
      ? getCombinedHtmlString(practice, "all", hasMedium, hasSlow)
      : getGroupedHtmlString(practice, hasMedium, hasSlow);

  return (
    <Box>
      <Alert status="info" mb={4}>
        <AlertIcon />
        Workouts created with the smart planner is displayed here. You can
        modify if you want.
      </Alert>
      <RadioGroup
        onChange={(v) => setDisplayHtml(v as DisplayType)}
        value={displayHtml}
      >
        <HStack gap={2} wrap="wrap">
          {displayTypes.map((type, i) => (
            <Radio key={i} value={type.value} mr={i === 0 ? 2 : 0}>
              {type.label}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      <LexicalComposer initialConfig={editorConfig}>
        <Box
          position="relative"
          lineHeight={1}
          textAlign="left"
          borderColor="gray.200"
          borderWidth={1}
          borderRadius={8}
          marginTop={4}
        >
          <HStack wrap="wrap" justify="space-between">
            <ToolbarPlugin />
            <CopyToClipboardPlugin />
          </HStack>
          <Box position="relative">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <PreviewPlugin initialHtml={htmlString} />
          </Box>
        </Box>
      </LexicalComposer>
    </Box>
  );
}
