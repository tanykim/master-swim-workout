import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ElapsedTimeTable from "./ElapsedTimeTable";
import TextEditor from "../editor/TextEditor";
import Practice from "./Practice";
import { PracticeProvider } from "../utils/PracticeContext";

export default function Create() {
  return (
    <PracticeProvider>
      <Tabs variant="enclosed" isLazy>
        <TabList>
          <Tab>🤓 Smart planner</Tab>
          <Tab>🗒 Text editor</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Practice />
            <ElapsedTimeTable />
          </TabPanel>
          <TabPanel>
            <TextEditor />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PracticeProvider>
  );
}
