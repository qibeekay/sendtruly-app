import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";
import ChatLogo from "./ChatLogo";

function ChatItem({ data, setCurrentChatData }) {
  return (
    <Stack
      direction="row"
      bg="white"
      p="10px"
      w="90%"
      alignItems="center"
      justifyContent="start"
      rounded="5px"
      cursor="pointer"
      onClick={() => setCurrentChatData(data)}
    >
      <ChatLogo data={data} />
      <Stack w="80%">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing="0px"
        >
          <Heading as="h4" size="md" fontSize="17px">
            {data?.lastName}
          </Heading>
          <Text fontSize="xs">{data?.lastChatTime}</Text>
        </Stack>
        <Text fontSize="xs">{data?.lastMessage}</Text>
      </Stack>
    </Stack>
  );
}

export default ChatItem;
