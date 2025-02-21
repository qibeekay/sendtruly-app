import React, { useEffect, useRef, useState } from "react";
// import styles from "./chats.module.css";

import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import ChatItem from "../../../components/chats/ChatItem";
import ChatWelcomePage from "../../../components/chats/ChatWelcomePage";
import ChatUserInfo from "../../../components/chats/ChatUserInfo";
import ChatSearchBar from "../../../components/chats/ChatSearchBar";
import ChatInput from "../../../components/chats/ChatInput";
import ChatMessage from "../../../components/chats/ChatMessage";
import { chatsData } from "../../../../FakeData";

import logo from "../../../assets/logo.png";
import ChatComingSoon from "../../../components/chats/ChatComingSoon";

function Chats() {
  const [chatState, setChatState] = useState(false);
  const [currentChatData, setCurrentChatData] = useState({});
  const [chatInputBox, setChatInputBox] = useState("");
  const [searchBox, setSearchBox] = useState("");

  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when the component mounts
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [currentChatData]);

  return (
    <DashboardLayout pageName={"Chats"}>
      {chatState ? (
        <>
          <ChatComingSoon />
        </>
      ) : (
        // <>
        //   {/* Main Chat Container  */}
        //   <Stack
        //     bg="#a1a8bb30"
        //     w="100%"
        //     h="80vh"
        //     mt="20px"
        //     border="1px solid #fc1e65"
        //     spacing="0px"
        //     rounded="5px"
        //   >
        //     {/* Chat Search Bar / User Info Display  */}
        //     <Stack direction="row" h="70px" spacing="0px">
        //       <Box
        //         w="30%"
        //         borderRight="1px solid #fc1e65"
        //         borderBottom="1px solid #fc1e65"
        //         display="flex"
        //         alignItems="center"
        //         justifyContent="center"
        //       >
        //         <ChatSearchBar
        //           searchBox={searchBox}
        //           setSearchBox={setSearchBox}
        //         />
        //       </Box>
        //       <Stack
        //         w="70%"
        //         justifyContent="center"
        //         alignItems="flex-start"
        //         borderBottom="1px solid #fc1e65"
        //       >
        //         <ChatUserInfo currentChatData={currentChatData} />
        //       </Stack>
        //     </Stack>

        //     {/* Chat Sidenav / Chat Main  */}
        //     <Stack
        //       direction="row"
        //       // bg="#a1a8bb30"
        //       overflowY="hidden"
        //       style={{
        //         scrollbarWidth: "5px",
        //       }}
        //       w="100%"
        //       h="80vh"
        //       spacing="0px"
        //       rounded="5px"
        //     >
        //       {/* Chat Sidenav  */}
        //       <Stack
        //         spacing="15px"
        //         p="20px 0px"
        //         // bg="red"
        //         style={{
        //           scrollbarWidth: "5px",
        //         }}
        //         w="30%"
        //         height="100%"
        //         alignItems="center"
        //         overflowY="scroll"
        //       >
        //         {chatsData
        //           ?.filter((item) =>
        //             item.lastName
        //               .toLowerCase()
        //               .includes(searchBox.toLowerCase())
        //           )
        //           .map((item, i) => {
        //             return (
        //               <ChatItem
        //                 key={i}
        //                 data={item}
        //                 setCurrentChatData={setCurrentChatData}
        //               />
        //             );
        //           })}
        //       </Stack>

        //       {/* Chat Main Display  */}
        //       {!currentChatData.firstName ? (
        //         <Stack
        //           bg="white"
        //           w="70%"
        //           h="100%"
        //           alignItems="center"
        //           justifyContent="center"
        //         >
        //           <img src={logo} width="100px" alt="" />
        //           <Heading as="h4" size="md" fontSize="18px">
        //             Drive More Revenue With 2-Way Reply
        //           </Heading>
        //           <Text fontSize="xs" maxWidth="400px" textAlign="center">
        //             Strengthen your customer relationships by leveraging the
        //             Two-Way Reply Center to provide feedback on the spot
        //           </Text>
        //         </Stack>
        //       ) : (
        //         <Stack bg="white" w="70%" h="100%" alignItems="center">
        //           <Stack h="100%" w="100%" overflowY="scroll" ref={chatBoxRef}>
        //             {currentChatData.chatList?.map((item, i) => {
        //               return (
        //                 <ChatMessage
        //                   key={i}
        //                   position={
        //                     currentChatData.usertoken === item.senderId
        //                       ? "right"
        //                       : "left"
        //                   }
        //                   message={item.message}
        //                 />
        //               );
        //             })}
        //           </Stack>

        //           {currentChatData.firstName && (
        //             <ChatInput
        //               chatInputBox={chatInputBox}
        //               setChatInputBox={setChatInputBox}
        //             />
        //           )}
        //         </Stack>
        //       )}
        //     </Stack>
        //   </Stack>
        // </>
        <ChatWelcomePage setChatState={setChatState} />
      )}
    </DashboardLayout>
  );
}

export default Chats;
