import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

function ChatComingSoon() {
  return (
    <Stack
      direction="row"
      spacing="30px"
      mt="30px"
      w="100%"
      minH="60vh"
      d="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <Heading as="h4" size="md" fontSize="25px" textAlign="center">
          Coming Soon!
        </Heading>
        <Text mt="20px" fontSize="16px" textAlign="center">
          We are working to get this feature online as fast as we can.
        </Text>
      </Box>
    </Stack>
  );
}

export default ChatComingSoon;
