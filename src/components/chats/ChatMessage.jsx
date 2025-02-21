import { Box } from "@chakra-ui/react";
import React from "react";

function ChatMessage({ position, message }) {
  return (
    <Box
      padding="10px 20px"
      //   position="absolute"
      bg={position === "right" ? "#fc1e65" : "#a1a8bb30"}
      color={position === "right" ? "white" : "black"}
      borderRadius={
        position === "right" ? "10px 10px 0 10px" : "0 10px 10px 10px"
      }
      display="inline-block"
      maxWidth="60%"
      margin="5px"
      // rounded="8px"
      alignSelf={position === "right" ? "flex-end" : "flex-start"}
    >
      {message}
    </Box>
  );
}

export default ChatMessage;
