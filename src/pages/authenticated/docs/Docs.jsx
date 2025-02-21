import React, { useState } from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRedo } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaCopy } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Docs() {
  const toast = useToast();
  const user_data = JSON.parse(localStorage.getItem("data_user_main"));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tokenModal, setTokenModal] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [apiTokenData, setApiTokenData] = useState([
    {
      token_name: "Marktrust",
      token_id: "19876",
      last_used: "20-10-2024",
    },
  ]);
  const [regenerateLoader, setRegenerateLoader] = useState(false);
  const [createKeyLoader, setCreateKeyLoader] = useState(false);
  const cancelRef = React.useRef();

  function handleCopy(value) {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }

  const modalWidth = useBreakpointValue({ base: "90%", md: "50%" });

  function regenerateKey() {
    setRegenerateLoader(true);
    setTimeout(() => {
      setRegenerateLoader(false);
      toast({
        title: "Api Key Updated!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }, 3000);
  }

  function addNewKey() {
    if (!tokenName) {
      return;
    }
    setCreateKeyLoader(true);
    setTimeout(() => {
      setApiTokenData((prv) => [
        ...prv,
        {
          token_name: tokenName,
          token_id: "6686868",
          last_used: new Date().getTime().toString(),
        },
      ]);

      setCreateKeyLoader(false);
      setTokenModal(false);
      toast({
        title: "Token Created!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }, 3000);
  }

  function truncateString(inputString, maxLength) {
    if (inputString.length <= maxLength) {
      return inputString;
    } else {
      return inputString.substring(0, maxLength) + "...";
    }
  }

  return (
    <DashboardLayout pageName={"API Docs"}>
      {/* <Box
        bg="#f5f5f5"
        boxShadow="-1px 1px 18px -3px rgba(122,122,122,0.3)"
        w="100%"
        mt="5"
        borderRadius="5px"
        p="20px"
      >
        <Text fontSize="23px" fontWeight="600">
          SendTruly API V1
        </Text>
        <Text fontSize="sm" fontWeight="500">
          Integrating with us? Read our guide about{" "}
          <Link
            to="https://documenter.getpostman.com/view/21023738/2s9YywdJvF"
            target="__blank"
          >
            <span style={{ color: "#fc1e65" }}>using our API</span>
          </Link>
        </Text>

        <TableContainer mt="25px" width={"100%"}>
          <Table size="md">
            <Thead>
              <Tr>
                <Th pl="0px">Name</Th>
                <Th>Last Used</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {apiTokenData.map((item, i) => {
                return (
                  <Tr key={i}>
                    <Td pl="0px">{item.token_name}</Td>
                    <Td>{item.last_used}</Td>
                    <Td>
                      <RiDeleteBinLine
                        style={{
                          fontSize: "25px",
                          cursor: "pointer",
                        }}
                        onClick={onOpen}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Button
          colorScheme="pink"
          bg="#fc1e65"
          _hover={{ bg: "#ff5088" }}
          size="sm"
          mt={5}
          onClick={() => setTokenModal(true)}
        >
          <IoMdAddCircleOutline style={{ marginRight: "4px" }} /> Create Token
        </Button>
      </Box> */}

      <Box
        bg="#f5f5f5"
        boxShadow="-1px 1px 18px -3px rgba(122,122,122,0.3)"
        w="100%"
        m="40px 0px"
        borderRadius="5px"
        p="20px"
      >
        <Text fontSize="23px" fontWeight="600">
          SendTruly API
        </Text>
        <Text fontSize="sm" fontWeight="500">
          Integrating with us? Read our guide about{" "}
          <Link
            to="https://documenter.getpostman.com/view/21023738/2s9YywdJvF"
            target="__blank"
          >
            <span style={{ color: "#fc1e65" }}>using our API</span>
          </Link>
        </Text>

        <Box mt="20px">
          <Box mt="20px">
            <Text fontSize="md" fontWeight="500">
              API KEY
            </Text>
            <Text
              display="flex"
              alignItems="center"
              fontSize="md"
              fontWeight="400"
            >
              {truncateString(user_data.api_key, 25)}{" "}
              <FaCopy
                style={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={() => handleCopy(user_data.api_key)}
              />
            </Text>
          </Box>

          <Box mt="20px">
            <Text fontSize="md" fontWeight="500">
              API URL
            </Text>
            <Text
              display="flex"
              alignItems="center"
              fontSize="md"
              fontWeight="400"
            >
              api.sendtruly.com{" "}
              <FaCopy
                style={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={() => handleCopy("api.sendtruly.com")}
              />
            </Text>
          </Box>
        </Box>

        <Button
          colorScheme="pink"
          bg="#fc1e65"
          _hover={{ bg: "#ff5088" }}
          size="sm"
          mt={5}
          isLoading={regenerateLoader}
          loadingText="Regenerating.."
          onClick={regenerateKey}
        >
          <FaRedo style={{ marginRight: "8px" }} /> Regenerate API Key
        </Button>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent width={modalWidth}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Token?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={tokenModal}
        onClose={() => setTokenModal(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent width={modalWidth}>
          <ModalHeader>Create Access Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="small">
              Please choose a name for your API Token in order to continue.
              Click "Create" when ready.
            </Text>

            <>
              <Text mb="8px" mt="15px">
                Token Name:
              </Text>
              <Input
                focusBorderColor="pink"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                size="md"
              />
            </>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={() => setTokenModal(false)}>
              Cancel
            </Button>
            <Button
              isLoading={createKeyLoader}
              loadingText="Creating"
              bg="#fc1e65"
              colorScheme="pink"
              _hover={{ bg: "#ff5088" }}
              onClick={addNewKey}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}

export default Docs;
