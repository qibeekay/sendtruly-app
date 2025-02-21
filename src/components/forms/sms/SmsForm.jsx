import React, { useEffect, useState } from "react";
import styles from "./smsform.module.css";
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
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  RadioGroup,
  Radio,
  useToast,
  CheckboxGroup,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  Wrap,
  WrapItem,
  Center,
  VStack,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { AxiosInstance } from "../../../config";
import PageLoader from "../../loaders/PageLoader";

function SmsForm({ form, changeState, setChangeState, setZero_contacts }) {
  const user_data = JSON.parse(localStorage.getItem("data_user_main"));
  const toast = useToast();
  const modalWidth = useBreakpointValue({ base: "90%", md: "50%" });

  // State to get file
  const [selectedFile, setSelectedFile] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [draftData, setDraftData] = useState([]);
  const [sentMessageData, setSentMessageData] = useState([]);

  const [draftToken, setDraftToken] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);

  const [smsStepper, setSmsStepper] = useState(1);

  const [estimateData, setEstimateData] = useState({});
  const loacalDraft = JSON.parse(localStorage.getItem("local_draft"));

  const [bulkSmsData, setBulkSmsData] = useState({
    sender_id: "",
    usertoken: user_data?.user?.usertoken || "",
    message: "",
    contacts: [],
    message_type: "",
    is_drafted: false,
    delivery_route: "direct-corporate",
    scheduled: false,
    scheduled_data: {},
  });

  // console.log(changeState)

  // send bulk sms api
  const sendBulkSms = async () => {
    onClose();
    setBulkSmsData((prv) => ({ ...prv, is_drafted: false }));

    setIsLoading(true);

    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/sms/send-sms`,
        { ...bulkSmsData, sms_cost: estimateData.estimated_price }
      );

      setIsLoading(false);

      if (res.data.success) {
        setSmsStepper(1);
        onOpen();

        setBulkSmsData({
          sender_id: "",
          usertoken: user_data?.user?.usertoken || "",
          message: "",
          contacts: [],
          message_type: "",
          is_drafted: false,
          delivery_route: "direct_refund",
          scheduled: false,
          scheduled_data: {},
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
  // save bulk sms as draft api
  const saveBulkSmsDraft = async () => {
    setIsLoading(true);
    const payload = bulkSmsData;
    delete payload.is_drafted;
    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/messages/draft-message`,
        payload
      );
      setIsLoading(false);

      if (res.data.success) {
        onOpen();
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
  // estimate sms cost api
  const estimateCost = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/cost/estimate-cost`,
        {
          usertoken: user_data?.user?.usertoken || "",
          list_token: bulkSmsData.contacts,
          message: bulkSmsData.message,
          delivery_route: bulkSmsData.delivery_route,
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        setSmsStepper(2);
        onOpen();
        setEstimateData(res.data.data);
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
      onOpen();
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  //  GENERAL FUNCTIONS TO FETCH DATA

  // get all lists list api
  const getAllLists = async () => {
    if (listData.length <= 0) {
      setIsLoading(true);
    }

    try {
      const res = await AxiosInstance.get(
        `${import.meta.env.VITE_APP_BASE_URL}/contact/get-all-lists`
        // {
        //   usertoken: user_data?.user?.usertoken || "",
        // }
      );
      setIsLoading(false);
      if (res.data.success) {
        setZero_contacts(false);
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
  // get all scheduled sms api
  const getAllScheduledSms = async () => {
    if (scheduleData.length <= 0) {
      setIsLoading(true);
    }

    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/messages/get-scheduled-messages`,
        {
          usertoken: user_data?.user?.usertoken || "",
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        setScheduleData(res.data.data);
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
      setScheduleData([]);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  // get all sent messages api
  const getAllSentMessages = async () => {
    if (sentMessageData.length <= 0) {
      setIsLoading(true);
    }

    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/messages/get-sent-messages`,
        {
          usertoken: user_data?.user?.usertoken || "",
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        setSentMessageData(res.data.data);
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
      setSentMessageData([]);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  // get all draft sms api
  const getAllDraftSms = async () => {
    if (draftData.length <= 0) {
      setIsLoading(true);
    }

    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/messages/get-drafts-messages`,
        {
          usertoken: user_data?.user?.usertoken || "",
        }
      );
      setIsLoading(false);
      if (res.data.success) {
        setDraftData(res.data.data);
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
      setDraftData([]);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  // delete draft sms api
  const deleteDraftSms = async () => {
    setButtonLoader(true);

    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/messages/delete-draft-messages`,
        {
          usertoken: user_data?.user?.usertoken || "",
          draft_token: draftToken,
        }
      );
      setButtonLoader(false);
      if (res.data.success) {
        getAllDraftSms();
        onClose();
        toast({
          title: "Deleted successfully!",
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
      setButtonLoader(false);
      toast({
        title: error.response?.data.message || error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Functions to handle input changes

  // const maxChars = 155;

  // const smsInputChange = (event) => {
  //   const { name, value } = event.target;

  //   setBulkSmsData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: name === "message" ? value.slice(0, maxChars) : value, // Limit only 'message' input
  //   }));
  // };

  const smsInputChange = (event) => {
    const { name, value } = event.target;
    // Update the specific field in the formData state
    setBulkSmsData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const scheduleInputChange = (event) => {
    const { name, value } = event.target;
    const oldData = bulkSmsData.scheduled_data;
    // Update the specific field in the formData state
    setBulkSmsData((prevFormData) => ({
      ...prevFormData,
      scheduled_data: {
        ...oldData,
        [name]: value,
      },
    }));
  };

  if (form === "compose") {
    useEffect(() => {
      if (changeState === 0) {
        getAllLists();
        if (loacalDraft) {
          setBulkSmsData(loacalDraft);
          localStorage.removeItem("local_draft");
        }
      }
    }, [changeState]);

    return (
      <>
        {smsStepper === 1 && (
          <>
            <PageLoader isLoading={isLoading} />
            <AlertDialog
              motionPreset="slideInBottom"
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              isOpen={isOpen}
              isCentered
            >
              <AlertDialogOverlay />
              {bulkSmsData.is_drafted ? (
                <AlertDialogContent width={modalWidth}>
                  <Alert
                    status="info"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="250px"
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                      Message Saved to Drafts!
                    </AlertTitle>
                    <AlertDescription mt={2} maxWidth="sm">
                      Your message has been saved to drafts.
                    </AlertDescription>
                  </Alert>
                </AlertDialogContent>
              ) : (
                <AlertDialogContent width={modalWidth}>
                  <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="250px"
                  >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                      Message submitted!
                    </AlertTitle>
                    <AlertDescription mt={2} maxWidth="sm">
                      Your message has been queued for dispatch and will be
                      received soon.
                    </AlertDescription>
                  </Alert>
                </AlertDialogContent>
              )}
            </AlertDialog>
            <form className={styles.compose_sms}>
              <FormControl mt="40px">
                <FormLabel fontFamily={"inherit"}>Sender ID</FormLabel>
                <input
                  placeholder="e.g: Chicken Republic"
                  name="sender_id"
                  value={bulkSmsData.sender_id}
                  onChange={smsInputChange}
                  required
                  className={styles.input}
                />
              </FormControl>

              <FormControl>
                <FormLabel mt={10} as="h5" size="sm" fontFamily={"inherit"}>
                  Message
                </FormLabel>
                <div>
                  <div className={styles.pdiv}></div>
                  <textarea
                    onResize={false}
                    name="message"
                    value={bulkSmsData.message}
                    onChange={smsInputChange}
                    placeholder="Enter message here..."
                    required
                    className={styles.textarea}
                  ></textarea>

                  {/* display limited characters */}

                  {/* <div className={styles.char}>
                    <p>
                      Page: 1, Characters left: {maxChars} , Total Typed
                      Characters: {bulkSmsData.message.length}
                    </p>
                  </div> */}
                </div>
              </FormControl>
              <FormControl required>
                <FormLabel mt={10} as="h5" size="sm" fontFamily={"inherit"}>
                  Select Contacts
                </FormLabel>
                <CheckboxGroup
                  onChange={(value) =>
                    setBulkSmsData({ ...bulkSmsData, contacts: value })
                  }
                  value={bulkSmsData.contacts}
                  required
                >
                  <Stack spacing={2} mt={4} required>
                    {listData.map((item, i) => {
                      return (
                        <Checkbox
                          key={i}
                          value={item.list_token}
                          colorScheme="green"
                          defaultChecked
                        >
                          {item.list_name}
                        </Checkbox>
                      );
                    })}
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              {/* message type */}
              <FormControl mt="40px">
                <FormLabel fontFamily={"inherit"}>Message Type</FormLabel>
                <Select
                  placeholder="Select message type"
                  name="message_type"
                  value={bulkSmsData.message_type}
                  onChange={smsInputChange}
                  _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
                  required
                >
                  <option value="standard">STANDARD SMS</option>
                  {/* <option value="2waysms">TWO-WAY SMS</option> */}
                </Select>
              </FormControl>

              {/* delivery gateway */}
              <FormControl mt="40px">
                <FormLabel fontFamily={"inherit"}>
                  Choose a Delivery Route/Gateway (Required)
                </FormLabel>
                <RadioGroup
                  defaultValue={bulkSmsData.delivery_route}
                  onChange={(value) =>
                    setBulkSmsData({ ...bulkSmsData, delivery_route: value })
                  }
                  required
                >
                  <Stack>
                    <div className={styles.contain}>
                      {/* direct-corporate */}
                      <Radio value="direct-corporate" colorScheme="green">
                        <div>
                          <p className={styles.delivertext}>
                            Direct-Corporate Route: Auto-resend to MTN DND
                            Number via the Corporate Route
                          </p>
                          <p className={styles.textlight}>
                            Delivers to ONLY non-DND numbers & Get a ₦3/page
                            refund for MTN DND numbers.
                          </p>
                        </div>
                      </Radio>
                    </div>
                    <div className={styles.contain1}>
                      {/* direct-refund */}
                      <Radio value="direct-refund" colorScheme="green">
                        <div>
                          <p className={styles.delivertext}>
                            Direct-Refund Route: Get A Refund for MTN DND
                            Numbers
                          </p>
                          <p className={styles.textlight}>
                            Delivers to non-DND and MTN DND Numbers. MTN numbers
                            will cost ₦4.99/pg
                          </p>
                        </div>
                      </Radio>
                    </div>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <button
                  type="button"
                  className={styles.schedule}
                  // colorScheme="green"
                  onClick={() =>
                    setBulkSmsData((prevData) => ({
                      ...prevData,
                      scheduled: !prevData.scheduled, // Toggle the state
                    }))
                  }
                >
                  Schedule
                </button>
              </FormControl>
              {bulkSmsData.scheduled && (
                <>
                  <FormControl>
                    <FormLabel mt={10} as="h5" size="sm" fontFamily={"inherit"}>
                      Select Date and Time
                    </FormLabel>
                    <Input
                      placeholder="Select Date and Time"
                      size="md"
                      name="date_time"
                      onChange={scheduleInputChange}
                      type="datetime-local"
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel mt={5} as="h5" size="sm" fontFamily={"inherit"}>
                      Schedule type
                    </FormLabel>
                    <Select
                      placeholder="Select"
                      name="schedule_type"
                      onChange={scheduleInputChange}
                      _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
                      required
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel mt={5} as="h5" size="sm" fontFamily={"inherit"}>
                      Number of time schedule should occur
                    </FormLabel>
                    <Select
                      placeholder="Select"
                      name="schedule_number"
                      onChange={scheduleInputChange}
                      _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
                      required
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </Select>
                  </FormControl>
                </>
              )}

              <Button
                width={"100%"}
                size="md"
                colorScheme="blue"
                border="2px"
                // _hover={{ bg: "#fc1e641b" }}
                background={"#fc1e65"}
                mt={10}
                variant="solid"
                type="submit"
                onClick={estimateCost}
              >
                Proceed to analysis
              </Button>
              <Button
                width={"100%"}
                size="md"
                colorScheme="blue"
                border="2px"
                mt={10}
                variant="outline"
                onClick={() => {
                  setBulkSmsData((prev) => ({ ...prev, is_drafted: true }));
                  saveBulkSmsDraft();
                }}
              >
                Save as draft
              </Button>
            </form>
          </>
        )}

        {smsStepper === 2 && (
          <>
            {isOpen && (
              <Alert status="error" mt={4}>
                {/* <AlertIcon /> */}
                <Box>
                  <AlertTitle>Your message has not been sent yet!</AlertTitle>
                  <AlertDescription>
                    Kindly go through the SMS summary and analysis below and
                    then click the 'Send Message' button at the bottom of the
                    page to send your message.
                  </AlertDescription>
                </Box>
                <CloseButton
                  alignSelf="flex-start"
                  position="relative"
                  right={-1}
                  top={-1}
                  onClick={onClose}
                />
              </Alert>
            )}
            <Heading mt={"50px"} textAlign="center" as="h2" size="md">
              SMS ANALYSIS SUMMARY
            </Heading>

            <Wrap mt={"50px"} spacing="30px" justify="space-evenly" w={"100%"}>
              <WrapItem>
                <VStack w="300px" spacing={0} align="center">
                  <Heading as="h2" size="xl">
                    #{estimateData?.estimated_price}
                  </Heading>
                  <Text mt={"20px"} fontSize="md">
                    SMS COST
                  </Text>
                </VStack>
              </WrapItem>
              <WrapItem>
                <VStack w="300px" spacing={0} align="center">
                  <Heading as="h2" size="xl">
                    {estimateData?.total_contacts}
                  </Heading>
                  <Text mt={"20px"} fontSize="md">
                    CONTACTS
                  </Text>
                  <Text fontSize="sm">(via {bulkSmsData.delivery_route})</Text>
                </VStack>
              </WrapItem>
              <WrapItem>
                <VStack w="300px" spacing={0} align="center">
                  <Heading as="h2" size="xl">
                    {estimateData?.pages}
                  </Heading>
                  <Text mt={"20px"} fontSize="md">
                    PAGE
                  </Text>
                  <Text fontSize="sm">
                    {estimateData?.total_characters} characters
                  </Text>
                </VStack>
              </WrapItem>
            </Wrap>

            <Button
              width={"100%"}
              size="md"
              isLoading={isLoading}
              loadingText="Loading"
              colorScheme="blue"
              border="2px"
              background={"#fc1e65"}
              mt={"60px"}
              variant="solid"
              onClick={() => sendBulkSms()}
            >
              Send Message
            </Button>
          </>
        )}
      </>
    );
  } else if (form === "personal") {
    return (
      <>
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

        <Text mt={4} as="h5" size="sm" fontFamily={"inherit"}>
          Senders Name
        </Text>
        <Input
          placeholder="Enter senders name"
          size="md"
          marginTop={"10px"}
          _focus={{ borderColor: "#fc1e65", boxShadow: "none" }}
        />
        <Button
          width={"100%"}
          size="md"
          colorScheme="blue"
          border="2px"
          background={"#fc1e65"}
          mt="24px"
          variant="solid"
        >
          Upload & Send
        </Button>
      </>
    );
  } else if (form === "scheduled") {
    useEffect(() => {
      if (changeState === 1) {
        getAllScheduledSms();
      }
    }, [changeState]);
    return (
      <>
        <PageLoader isLoading={isLoading} />
        <TableContainer width={"100%"}>
          <Table size="md">
            <Thead>
              <Tr>
                <Th pl="0px">Sender</Th>
                <Th>Delivery Date</Th>
                <Th>Volume</Th>
                <Th>Cost</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {scheduleData.map((item, i) => {
                return (
                  <Tr key={i}>
                    <Td pl="0px">{item.sender_id}</Td>
                    <Td>{item.sent_date}</Td>
                    <Td>{item.contact_count}</Td>
                    <Td>₦{item.sms_cost} </Td>
                    <Td>
                      <Stack flexDirection={"row"}>
                        {/* <Badge variant="solid" colorScheme="yellow">
                          <FaEdit className={styles.icon} />
                        </Badge> */}
                        <Badge variant="solid" colorScheme="red">
                          <RiDeleteBinLine
                            className={styles.icon}
                            onClick={onOpen}
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
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete List?
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
      </>
    );
  } else if (form === "sent") {
    useEffect(() => {
      if (changeState === 2) {
        getAllSentMessages();
      }
    }, [changeState]);
    return (
      <>
        <PageLoader isLoading={isLoading} />
        <TableContainer width={"100%"}>
          <Table size="md">
            <Thead>
              <Tr>
                <Th pl="0px">Sender</Th>
                <Th>Delivery Date</Th>
                <Th>Volume</Th>
                <Th>Cost</Th>
                {/* <Th>Actions</Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {sentMessageData.map((item, i) => {
                return (
                  <Tr key={i}>
                    <Td pl="0px">{item.sender_id}</Td>
                    <Td>{item.sent_date}</Td>
                    <Td>{item.contact_count}</Td>
                    <Td>₦{item.sms_cost} </Td>
                    {/* <Td>
                      <FaExternalLinkAlt />
                    </Td> */}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  } else {
    useEffect(() => {
      if (changeState === 3) {
        getAllDraftSms();
      }
    }, [changeState]);

    return (
      <>
        <PageLoader isLoading={isLoading} />
        <TableContainer width={"100%"}>
          <Table size="md">
            <Thead>
              <Tr>
                <Th pl="0px">Sender</Th>
                <Th>Date Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {draftData.map((item, i) => {
                return (
                  <Tr key={i}>
                    <Td pl="0px">{item.sender_id}</Td>
                    <Td>{item.created_date}</Td>
                    <Td>
                      <Stack flexDirection={"row"}>
                        <Badge
                          variant="solid"
                          colorScheme="yellow"
                          onClick={() => {
                            localStorage.setItem(
                              "local_draft",
                              JSON.stringify(item.data)
                            );
                            // setBulkSmsData(item);
                            setChangeState(0);
                          }}
                        >
                          <FaEdit className={styles.icon} />
                        </Badge>
                        <Badge variant="solid" colorScheme="red">
                          <RiDeleteBinLine
                            className={styles.icon}
                            onClick={() => {
                              setDraftToken(item.draft_token);
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
                Delete List?
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
                  onClick={deleteDraftSms}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    );
  }
}

export default SmsForm;
