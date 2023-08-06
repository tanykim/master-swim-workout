import { tabsAnatomy, accordionAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

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

// export the component theme
export const tabsTheme = defineTabsConfig({ baseStyle: tabsBaseStyle });
export const accordionTheme = defineAccordionConfig({
  baseStyle: accordionBaseStyle,
});
