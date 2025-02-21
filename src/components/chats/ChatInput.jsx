import React from "react";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoSend } from "react-icons/io5";
function ChatInput({ chatInputBox, setChatInputBox }) {
  return (
    <InputGroup
      colorScheme="red"
      size="md"
      mb="20px"
      w="90%"
      border="1px solid black"
      rounded="6px"
    >
      <Input
        focusBorderColor="black"
        border="10px"
        variant="outline"
        pr="4.5rem"
        type="text"
        value={chatInputBox}
        onChange={(e) => setChatInputBox(e.target.value)}
        placeholder="Message"
      />
      <InputRightElement width="4.5rem">
        <Button colorScheme="pink" h="1.75rem" size="sm">
          <IoSend />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default ChatInput;
