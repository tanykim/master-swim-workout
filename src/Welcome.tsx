import { Text, VStack } from "@chakra-ui/react";

export default function Welcome() {
  return (
    <VStack align="left" width="4xl">
      <Text>👋 Hello</Text>
      <Text>
        This app helps you create workouts for a master swim team that consists
        of swimmers at various paces.
      </Text>
      <Text>
        Currently, the pool length and intervals are based on Temescal Masters.
        We plan to add a setting menu where you can set a different pool length,
        unit, and lane pace.
      </Text>
      <Text>
        If you have any feedback, please email us at <b>tanykim@gmail.com</b>.
      </Text>
    </VStack>
  );
}
