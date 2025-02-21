import { Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import ChatLogo from "./ChatLogo";

function ChatUserInfo({ currentChatData }) {
  return (
    <Stack
      direction="row"
      ml="10px"
      alignItems="center"
      justifyContent="center"
    >
      <ChatLogo data={currentChatData} />
      <Stack spacing="2px">
        <Heading as="h4" size="md" fontSize="18px">
          {currentChatData?.lastName}
        </Heading>
        <Text fontSize="xs">{currentChatData?.phoneNumber}</Text>
      </Stack>
    </Stack>
  );
}

export default ChatUserInfo;
