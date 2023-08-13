import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  RadioGroup,
  Radio,
  Stack,
  Text,
  useRadioGroup,
} from "@chakra-ui/react";
import { BASE_DISTANCE, BASE_LENGTH, DISTANCE_UNIT } from "./utils/const";
import IntervalsTable from "./IntervalsTable";

export type NumberFormat = "original" | "round" | "ceiling" | "floor";

export default function Intervals() {
  const lengths = Array.from({ length: BASE_LENGTH }, (_, i) => i + 1);
  const length_dist = BASE_DISTANCE / BASE_LENGTH;

  // Show up to 4 times of base length
  const lenList = [0, 1, 2, 3].flatMap((dist) =>
    lengths.map((len, i) => {
      const value = BASE_LENGTH * dist + len; // laps
      const unit = Math.round(length_dist * value * 100) / 100;
      const label = `${value}L${
        i === lengths.length - 1 ? ` (${unit}${DISTANCE_UNIT})` : ""
      }`;
      return { value, label };
    })
  );

  const { value: intervalFormat, getRadioProps } = useRadioGroup({
    defaultValue: "ceiling",
  });

  return (
    <>
      <RadioGroup defaultValue="ceiling" mb={4}>
        <Stack spacing={4} direction="row" align="flex-end">
          <Text>
            Calculated based on {BASE_DISTANCE}
            {DISTANCE_UNIT}
          </Text>
          <Radio {...getRadioProps({ value: "original" })}>Round by 1s</Radio>
          <Radio {...getRadioProps({ value: "round" })}>Round by 5s</Radio>
          <Radio {...getRadioProps({ value: "ceiling" })}>Ceiling by 5s</Radio>
          <Radio {...getRadioProps({ value: "floor" })}>Floor by 5s</Radio>
        </Stack>
      </RadioGroup>
      <Accordion defaultIndex={[BASE_LENGTH - 1]} allowMultiple>
        {lenList.map((len, i) => (
          <AccordionItem key={i}>
            <h3>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" fontSize="xl">
                  {len.label}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel p={0} pb={4}>
              <IntervalsTable
                length={len.value}
                format={intervalFormat as NumberFormat}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
