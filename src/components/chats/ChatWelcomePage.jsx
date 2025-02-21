import React from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { MdOutlineInfo } from "react-icons/md";

function ChatWelcomePage({ setChatState }) {
  const [isSmallerThan700] = useMediaQuery("(max-width: 700px)");
  return (
    <Stack
      direction="row"
      spacing={isSmallerThan700 ? "0px" : "30px"}
      mt="30px"
    >
      <Box width={isSmallerThan700 ? "100%" : "50%"}>
        <Heading as="h4" size="md" fontSize="25px">
          Drive More Revenue With 2-Way Reply
        </Heading>
        <Text mt="50px" fontSize="16px">
          Never leave a customer unread again. Strengthen your customer
          relationships by leveraging the Two-Way Reply Center to provide
          feedback on the spot, respond to messages, or view recent chat history
          inside the 30-day log.
        </Text>
        <Stack
          direction="row"
          bg="black"
          width={isSmallerThan700 ? "100%" : "70%"}
          h="100px"
          mt="40px"
          alignItems="start"
          justifyContent="center"
          padding="20px"
          rounded="5px"
        >
          <Box color="white" w="8%">
            <MdOutlineInfo />
          </Box>
          <Box w="92%" color="white">
            <Text fontSize="14px">
              Did you know that the average response time for an SMS is 90
              seconds, compared to 90 minutes for email?
            </Text>
          </Box>
        </Stack>
        <Heading as="h5" size="md" fontSize="17px" color="black" mt="30px">
          Get Started With Your Free Trial Today.
        </Heading>
        <Stack direction="row" spacing="10px" mt="20px">
          <Button
            colorScheme="pink"
            bg="#fc1e65"
            size="md"
            onClick={() => setChatState(true)}
          >
            Get Started
          </Button>
          {/* <Button colorScheme="gray" size="md">
            Learn More
          </Button> */}
        </Stack>
      </Box>
      <Box></Box>
    </Stack>
  );
}

export default ChatWelcomePage;
