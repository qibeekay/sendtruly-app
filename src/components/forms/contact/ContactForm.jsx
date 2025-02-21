import React, { useEffect, useState } from "react";
import styles from "./contactform.module.css";
import {
  Button,
  Input,
  Text,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Stack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  FormControl,
  FormLabel,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineChevronLeft } from "react-icons/md";
import { AxiosInstance } from "../../../config";
import {
  parsePhoneNumbers,
  unparsePhoneNumbers,
} from "../../../utility/UtilityFunctions";
import PageLoader from "../../loaders/PageLoader";
function ContactForm({ form, changeState }) {
  const user_data = JSON.parse(localStorage.getItem("data_user_main"));
  const modalWidth = useBreakpointValue({ base: "90%", md: "50%" });
  const toast = useToast();
  // State to get file
  const [selectedFile, setSelectedFile] = useState(null);
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  // Modal state and ref
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [editState, setEditState] = useState(false);
  // createListData
  const [createListData, setCreateListData] = useState({
    country: "",
    list_name: "",
    contact_numbers: "",
    usertoken: user_data?.user?.usertoken || "",
    // Add more fields as needed
  });

  const [listData, setListData] = useState([]);
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    getCountryList();
  }, []);

  const createListChange = (e) => {
    const { name, value } = e.target;
    // Update the state with the new value
    setCreateListData({
      ...createListData,
      [name]: value,
    });
  };

  // get country list api
  const getCountryList = async () => {
    if (countryList.length <= 0) {
      setIsLoading(true);
    }

    try {
      const res = await AxiosInstance.get(
        `${import.meta.env.VITE_APP_BASE_URL}/get-country`
      );
      setIsLoading(false);
      if (res.data.success) {
        setCountryList(res.data.data);
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      // setCountryList([]);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  // get all lists list api
  const getAllLists = async () => {
    if (listData.length <= 0) {
      setIsLoading(true);
    }

    try {
      const res = await AxiosInstance.get(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/get-all-lists`
        // {
        //   usertoken: user_data.user?.user?.usertoken || "",
        // }
      );
      setIsLoading(false);
      if (res.data.success) {
        setListData(res.data.data);
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      setListData([]);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  // get one lists list api
  const getSingleList = async (listToken) => {
    setIsLoading(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/get-list-by-token`,
        {
          list_token: listToken,
          usertoken: user_data?.user?.usertoken,
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        setCreateListData({
          list_name: res.data.data.list_name,
          contact_numbers: unparsePhoneNumbers(res.data.data.contact_numbers),
          usertoken: user_data?.user?.usertoken,
          list_token: res.data.data.list_token,
        });
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Upload list api
  const createList = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/create-list`,
        {
          ...createListData,
          contact_numbers: parsePhoneNumbers(createListData.contact_numbers),
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        getAllLists();
        toast({
          title: "list created.",
          description: "We've created a new list for you.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setCreateListData({
          list_name: "",
          contact_numbers: "",
          usertoken: user_data?.user?.usertoken,
        });
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  // edit list api
  const editList = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/update-contact-list`,
        {
          list_token: createListData.list_token,
          usertoken: createListData?.user?.usertoken,
          contacts: [
            {
              list_name: createListData.list_name,
              contact_numbers: parsePhoneNumbers(
                createListData.contact_numbers
              ),
            },
          ],
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        toast({
          title: "list updated successfully!",
          description: "We've updated your list for you.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          setEditState(false);
        }, 2000);
        getAllLists();
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // delete list
  const deleteList = async () => {
    setButtonLoader(true);
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/delete-user-list`,
        {
          list_token: createListData?.list_token,
          usertoken: createListData?.user?.usertoken,
        }
      );
      setButtonLoader(false);
      if (res.data.success) {
        getAllLists();
        toast({
          title: "list deleted successfully!",
          description: "We've updated your list for you.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: res.data.message,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      setButtonLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("contacts", selectedFile);
      formData.append("usertoken", user_data?.user?.usertoken || "");
      formData.append("list_name", createListData.list_name || "");

      try {
        const res = await AxiosInstance.post(
          `${import.meta.env.VITE_APP_BASE_URL}/contact/bulk-upload-contacts`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data; boundary=" + formData._boundary,
            },
          }
        );
        setIsLoading(false);
        if (res.data.success) {
          getAllLists();
          toast({
            title: "list uploaded successfully!",
            description: "We've created your list for you.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: res.data.message,
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
        }
      } catch (error) {
        setIsLoading(false);
        toast({
          title: error.response?.data.message || error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "No file selected",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (form === "create") {
    return (
      <>
        <PageLoader isLoading={isLoading} />
        <form className={styles.create_list} onSubmit={createList}>
          <FormControl mt={4}>
            <FormLabel fontFamily={"inherit"}>Country</FormLabel>
            <Select
              placeholder="Select country"
              _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
              name="country"
              value={createListData.country}
              onChange={createListChange}
              required
            >
              {countryList.map((item, i) => {
                return (
                  <option key={i} value={item.country}>
                    {item.country}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <Text mt={4} as="h5" size="sm" fontFamily={"inherit"}>
            Group Name
          </Text>
          <Input
            placeholder="Enter phone group name"
            size="md"
            marginTop={"10px"}
            name="list_name"
            value={createListData.list_name}
            onChange={createListChange}
            _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
            required
          />
          <Text mt={10} as="h5" size="sm" fontFamily={"inherit"}>
            Phone Numbers
          </Text>
          <Textarea
            marginTop={"10px"}
            resize="none"
            height={"200px"}
            name="contact_numbers"
            value={createListData.contact_numbers}
            onChange={createListChange}
            _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
            placeholder="Enter phone numbers separated by comma in any of these formats 07056150796, +2347056150796. Duplicate numbers will be removed before saving"
            required
          />
          <Button
            width={"100%"}
            size="md"
            colorScheme="blue"
            border="2px"
            type="submit"
            // borderColor="#fc1e65"
            // color="#fc1e65"
            // _hover={{ bg: "#fc1e641b" }}
            background={"#fc1e65"}
            mt={10}
            variant="solid"
            isLoading={isLoading}
            loadingText="Saving.."
          >
            Save list
          </Button>
        </form>
      </>
    );
  } else if (form === "manage") {
    useEffect(() => {
      getAllLists();
    }, [changeState]);

    return (
      <>
        {editState ? (
          <>
            <PageLoader isLoading={isLoading} />
            <Text
              mt={4}
              as="h5"
              size="md"
              fontFamily={"inherit"}
              display="flex"
              alignItems="center"
              mb="20px"
              fontSize="17px"
              onClick={() => setEditState(false)}
              cursor="pointer"
            >
              <MdOutlineChevronLeft style={{ fontSize: "25px" }} /> Go Back
            </Text>
            <form className={styles.create_list} onSubmit={editList}>
              <Text mt={4} as="h5" size="sm" fontFamily={"inherit"}>
                Group Name
              </Text>
              <Input
                placeholder="Enter phone group name"
                size="md"
                marginTop={"10px"}
                name="list_name"
                value={createListData.list_name}
                onChange={createListChange}
                _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
                required
              />
              <Text mt={10} as="h5" size="sm" fontFamily={"inherit"}>
                Phone Numbers
              </Text>
              <Textarea
                marginTop={"10px"}
                resize="none"
                height={"200px"}
                name="contact_numbers"
                value={createListData.contact_numbers}
                onChange={createListChange}
                _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
                placeholder="Enter phone numbers separated by comma in any of these formats 07056150796, +2347056150796. Duplicate numbers will be removed before saving"
                required
              />
              <Button
                width={"100%"}
                size="md"
                colorScheme="blue"
                border="2px"
                type="submit"
                background={"#fc1e65"}
                mt={10}
                variant="solid"
              >
                {isLoading ? "Saving.." : "Edit list"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <PageLoader isLoading={isLoading} />
            <TableContainer width={"100%"}>
              <Table size="md">
                <Thead>
                  <Tr>
                    <Th pl="0px">List Name</Th>
                    <Th>Contact No</Th>
                    <Th>Date Created</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listData.map((item, i) => {
                    return (
                      <Tr key={i}>
                        <Td pl="0px">{item.list_name}</Td>
                        <Td>{item.total_numbers.toLocaleString()}</Td>
                        <Td>{item.date_created}</Td>
                        <Td>
                          <Stack flexDirection={"row"}>
                            <Badge variant="solid" colorScheme="yellow">
                              <FaEdit
                                className={styles.icon}
                                onClick={() => {
                                  setEditState(true);
                                  return getSingleList(item.list_token);
                                }}
                              />
                            </Badge>
                            <Badge variant="solid" colorScheme="red">
                              <RiDeleteBinLine
                                className={styles.icon}
                                onClick={() => {
                                  setCreateListData({
                                    ...createListData,
                                    list_token: item.list_token,
                                  });
                                  onOpen();
                                }}
                              />
                            </Badge>
                          </Stack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>

            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              isCentered
            >
              <AlertDialogOverlay>
                <AlertDialogContent width={modalWidth}>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete this List?
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isLoading={buttonLoader}
                      loadingText="Deleting.."
                      colorScheme="red"
                      onClick={deleteList}
                      ml={3}
                    >
                      Delete{" "}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <form onSubmit={handleUpload}>
        <div className={styles.dropzone_container}>
          <Text mt={4} as="h5" size="sm" fontFamily={"inherit"}>
            Or select a file
          </Text>
          <label htmlFor="csv_file_input" className={styles.dropzone_inner}>
            <div>
              <input
                type="file"
                name="csv_file_input"
                id="csv_file_input"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];

                  // Check if the selected file is a CSV file
                  if (file && file.type === "text/csv") {
                    setSelectedFile(file);
                  } else {
                    alert("Please select a valid CSV file!");
                  }
                }}
                required
              />
              <p>Drag 'n' drop the file here, or click to select file</p>
            </div>
          </label>
          {selectedFile && <li>{selectedFile?.name}</li>}
        </div>
        <Text mt={4} as="h5" size="sm" fontFamily={"inherit"}>
          Group Name
        </Text>

        <Input
          placeholder="Enter phone group name"
          size="md"
          name="list_name"
          value={createListData.list_name}
          onChange={createListChange}
          marginTop={"10px"}
          _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
          required
        />

        <FormControl mt={4}>
          <Text as="h5" size="sm" fontFamily={"inherit"}>
            Country
          </Text>
          <Select
            placeholder="Select country"
            _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
            name="country"
            value={createListData.country}
            onChange={createListChange}
            required
          >
            {countryList.map((item, i) => {
              return (
                <option key={i} value={item.country}>
                  {item.country}
                </option>
              );
            })}
          </Select>
        </FormControl>
        <Button
          width={"100%"}
          size="md"
          colorScheme="blue"
          border="2px"
          type="submit"
          background={"#fc1e65"}
          mt="24px"
          variant="solid"
          isLoading={isLoading}
          loadingText="Uploading.."
        >
          Upload & Save
        </Button>
      </form>
    </>
  );
}

export default ContactForm;
