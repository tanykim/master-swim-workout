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
import { getHtmlString, getSeparateHtmlString } from "./utils/converter";
import {
  Box,
  Radio,
  RadioGroup,
  HStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { INTERVAL_BASE } from "./utils/const";

interface Props {
  workoutGroups: SingleWorkoutGroup[];
  totalLaps: number;
  totalLapsSlowLane: number;
}

export type DisplayType = "separate" | "combined";

const displayTypes: { value: DisplayType; label: string }[] = [
  { value: "separate", label: "Show slow lanes separately" },
  { value: "combined", label: "Show combined like (slow lanes)" },
];

export default function TextEditor({
  workoutGroups,
  totalLaps,
  totalLapsSlowLane,
}: Props) {
  const [displayHtml, setDisplayHtml] = useState<DisplayType>("separate");

  const htmlString =
    displayHtml === "combined"
      ? getHtmlString(
          workoutGroups,
          totalLaps,
          INTERVAL_BASE,
          totalLapsSlowLane,
          true
        )
      : getSeparateHtmlString(workoutGroups, totalLaps, totalLapsSlowLane);

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
        <HStack gap={4}>
          {displayTypes.map((type) => (
            <Radio key={type.value} value={type.value}>
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
    </Box>
  );
}
