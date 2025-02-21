import { Box } from "@chakra-ui/react";
import React from "react";

function ChatLogo({ data }) {
  function capitalizeFirstLetter(inputString) {
    // Check if the input is a valid string
    if (typeof inputString !== "string" || inputString.length === 0) {
      return "";
    }

    // Extract the first letter and capitalize it
    const firstLetter = inputString.charAt(0).toUpperCase();

    return firstLetter;
  }

  if (!data.firstName) {
    return;
  }

  return (
    <Box
      w="40px"
      h="40px"
      rounded="50%"
      bg="black"
      display="flex"
      justifyContent="center"
      fontSize="20px"
      alignItems="center"
      color="white"
    >
      {capitalizeFirstLetter(data?.firstName)}
      {capitalizeFirstLetter(data?.lastName)}
    </Box>
  );
}

export default ChatLogo;
