import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { MdAdd, MdEdit, MdTableChart, MdTimer } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <VStack align="left" maxWidth="4xl">
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
      <HStack gap={2} wrap="wrap" mt={4}>
        <Link to="/create">
          <Button colorScheme="blue" leftIcon={<MdEdit />}>
            Create practice
          </Button>
        </Link>
        <Link to="/intervals">
          <Button colorScheme="blue" variant="outline" leftIcon={<MdTimer />}>
            Interval calculation
          </Button>
        </Link>
      </HStack>
    </VStack>
  );
}
