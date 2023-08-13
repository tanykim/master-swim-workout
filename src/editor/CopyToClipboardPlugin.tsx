import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { copyToClipboard } from "@lexical/clipboard";
import { $selectAll } from "lexical";
import { Button, Tooltip } from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";

const CopyToClipboardPlugin = () => {
  const [editor] = useLexicalComposerContext();
  return (
    <div className="clipboard">
      <Tooltip
        hasArrow
        label="Copy with format, paste in your editor later"
        placement="top"
      >
        <Button
          colorScheme="blue"
          size="sm"
          leftIcon={<MdContentCopy />}
          onClick={() => {
            editor.update(() => {
              $selectAll();
              copyToClipboard(editor, null);
            });
          }}
        >
          Copy to clipboard
        </Button>
      </Tooltip>
    </div>
  );
};

export default CopyToClipboardPlugin;
