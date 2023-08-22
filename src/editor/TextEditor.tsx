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
  getHtmlString,
  getSeparateHtmlString,
  getTotalLapsPerGroup,
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
import { INTERVAL_BASE } from "../utils/const";
import { usePractice } from "../utils/PracticeContext";
import "./editor.css";

export type DisplayType = "separate" | "combined";

const displayTypes: { value: DisplayType; label: string }[] = [
  { value: "separate", label: "Show slow lanes separately" },
  { value: "combined", label: "Show combined like (slow lanes)" },
];

export default function TextEditor() {
  const practice = usePractice();
  const totalLaps = practice.reduce((acc, group) => {
    acc += getTotalLapsPerGroup(group.workoutList) * group.rounds;
    return acc;
  }, 0);

  const totalLapsAlt = practice.reduce((acc, group) => {
    acc +=
      getTotalLapsPerGroup(group.workoutList, true) *
      (group.roundsAlt ?? group.rounds);
    return acc;
  }, 0);

  const [displayHtml, setDisplayHtml] = useState<DisplayType>("separate");

  const htmlString =
    displayHtml === "combined"
      ? getHtmlString(practice, totalLaps, INTERVAL_BASE, "both", totalLapsAlt)
      : getSeparateHtmlString(practice, totalLaps, totalLapsAlt);

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
