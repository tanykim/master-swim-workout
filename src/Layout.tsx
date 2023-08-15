import {
  ChakraProvider,
  Heading,
  Flex,
  Text,
  Box,
  HStack,
} from "@chakra-ui/react";
import { Outlet, useMatch, useResolvedPath } from "react-router";
import { Link, LinkProps } from "react-router-dom";
import { theme } from "./styles/theme";

function CustomLink({ children, to, ...props }: LinkProps) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <Link to={to} {...props}>
      <Text
        fontSize="lg"
        fontWeight={match ? 700 : 400}
        textUnderlineOffset={8}
      >
        {children}
      </Text>
    </Link>
  );
}

export default function Layout() {
  return (
    <ChakraProvider theme={theme}>
      <Flex
        justify="space-between"
        backgroundColor="blue.50"
        p={4}
        borderBottomColor="gray.100"
        borderBottomWidth={1}
      >
        <Heading as="h1" size="lg">
          Master swim workout
        </Heading>
        <nav>
          <HStack gap={6} px={4}>
            <CustomLink to="/">🐟 Home</CustomLink>
            <CustomLink to="/create">✏️ Create</CustomLink>
            <CustomLink to="/intervals">⌛ Intervals</CustomLink>
          </HStack>
        </nav>
      </Flex>
      <Box mt={4} mb={16} mx={4}>
        <Outlet />
      </Box>
      <Box
        p={4}
        backgroundColor="gray.50"
        position="fixed"
        width="100%"
        bottom="0"
        color="gray.600"
        borderTopColor="gray.100"
        borderTopWidth={1}
      >
        <Text fontSize="sm">Made with 💙 by Tanyoung Kim</Text>
      </Box>
    </ChakraProvider>
  );
}
