import React from "react";
import {
  Box,
  Heading,
  ChakraProvider,
  extendTheme,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Intervals from "./Intervals";
import { tabsTheme, accordionTheme } from "./styles/theme";
import Planner from "./Planner";

const FONT_FAMILY =
  '"Karla", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto","Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue"';

const theme = extendTheme({
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
    Tabs: tabsTheme,
    Accordion: accordionTheme,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
        <Heading as="h1" mb={4} size="lg">
          Master swim workout
        </Heading>
        <Tabs variant="enclosed" width="4xl" size="sm">
          <TabList>
            <Tab as="h2">Planner</Tab>
            <Tab as="h2">Intervals</Tab>
          </TabList>
          <TabPanels>
            <TabPanel pt={6} pb={4}>
              <Planner />
            </TabPanel>
            <TabPanel>
              <Intervals />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
