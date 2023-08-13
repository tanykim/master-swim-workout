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
      <Box margin={4}>
        <Flex justify="space-between">
          <Link to="/">
            <Heading as="h1" mb={4} size="lg">
              Master swim workout
            </Heading>
          </Link>
          <nav>
            <HStack gap={6} px={4}>
              <CustomLink to="/create">✏️ Create</CustomLink>
              <CustomLink to="/intervals">⌛ Intervals</CustomLink>
            </HStack>
          </nav>
        </Flex>
        <Outlet />
      </Box>
    </ChakraProvider>
  );
}
