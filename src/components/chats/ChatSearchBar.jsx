import React, { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

import { IoSearchSharp } from "react-icons/io5";

function ChatSearchBar({ searchBox, setSearchBox }) {
  return (
    <InputGroup
      size="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="0px 15px"
    >
      <InputLeftElement
        width="4.5rem"
        h="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="22px"
      >
        <IoSearchSharp />
      </InputLeftElement>
      <Input
        variant="unstyled"
        value={searchBox}
        onChange={(e) => setSearchBox(e.target.value)}
        pl="2.5rem"
        type="text"
        placeholder="Search.."
      />
    </InputGroup>
  );
}

export default ChatSearchBar;
