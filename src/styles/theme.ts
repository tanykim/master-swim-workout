import { tabsAnatomy, accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, extendTheme } from "@chakra-ui/react";

const FONT_FAMILY =
  '"Karla", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto","Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue"';

const {
  definePartsStyle: defineTabsStyle,
  defineMultiStyleConfig: defineTabsConfig,
} = createMultiStyleConfigHelpers(tabsAnatomy.keys);

const {
  definePartsStyle: defineAccordionStyle,
  defineMultiStyleConfig: defineAccordionConfig,
} = createMultiStyleConfigHelpers(accordionAnatomy.keys);

// define the base component styles
const tabsBaseStyle = defineTabsStyle({
  tab: {
    fontWeight: 700, // change the font weight
    _hover: {
      cursor: "pointer",
    },
  },
  tabpanel: {
    padding: 0,
  },
});

const accordionBaseStyle = defineAccordionStyle({
  button: {
    fontWeight: 400,
    _hover: { backgroundColor: "blue.500", color: "white" },
  },
});

export const theme = extendTheme({
  fonts: {
    body: FONT_FAMILY,
    heading: FONT_FAMILY,
    mono: '"Inconsolata", source-code-pro, Menlo, Monaco, Consolas, monospace',
  },
  fontWeight: {
    heading: 700,
    text: 400,
  },
  styles: {
    global: {
      "body, heading": {
        color: "gray.800",
        lineHeight: "tall",
      },
    },
  },
  semanticTokens: {
    colors: {
      primary: {
        default: "gray.800",
      },
      secondary: {
        default: "gray.500",
      },
    },
  },
  components: {
    Tabs: defineTabsConfig({ baseStyle: tabsBaseStyle }),
    Accordion: defineAccordionConfig({
      baseStyle: accordionBaseStyle,
    }),
  },
});
