import React, { useEffect, useState } from "react";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
  ModalFooter,
  Input,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import styles from "./dashboard.module.css";

import { FaNairaSign } from "react-icons/fa6";
import PageLoader from "../../../components/loaders/PageLoader";
import { Link, useNavigate } from "react-router-dom";
import PaystackButton from "../../../payments/Paystack";
import { AxiosInstance } from "../../../config";
import { GetDashboardInfo } from "../../../api/dashboard";
import { ChangePlans } from "../../../api/profile";
import SwitchplanModal from "../../../components/layouts/dashboard/SwitchplanModal";
import CustomModal from "../../../utility/CustomModal";

function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("data_user_main"))
  );
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [payment_step, setPayment_step] = useState(0);
  const [amount, setAmount] = useState("");
  const [zero_contacts, setZero_contacts] = useState(false);
  const [trxHistory, setTrxHistory] = useState([]);
  const [info, setInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();

  // Sync localStorage with state
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data_user_main"));
    if (data) {
      setUserData(data);
    }
  }, []);

  const modalWidth = useBreakpointValue({ base: "90%", md: "50%" });

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Open modal
  const openModal1 = () => setIsOpen(true);

  // Close modal
  const closeModal1 = () => setIsOpen(false);

  // get all lists list api
  const getUserData = async () => {
    setIsLoading(true);
    const result = await GetDashboardInfo(userData?.token);
    setInfo(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  // handle account funding
  const handleAccountFund = async (payload) => {
    const payment_data = { ...payload, purpose: "wallet_funding" };
    delete payment_data.status;

    setPayment_step((prv) => !prv);
    if (!payload.status) {
      return toast({
        title: "Payment Cancelled!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setIsLoading(true);
    try {
      const res = await AxiosInstance.get(
        `${import.meta.env.VITE_APP_BASE_URL}/payment/verify-payment`,
        payment_data
      );
      setIsLoading(false);

      if (res.data.success) {
        getTransactions();
        setPayment_step((prv) => !prv);
        onClose();
        toast({
          title: "Account Credited Successfully!",
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
  };

  const getTransactions = async () => {
    if (trxHistory.length <= 0) setIsLoading(true);

    try {
      const res = await AxiosInstance.post(
        `${import.meta.env.VITE_APP_BASE_URL}/payment/get-payment-history`,
        { usertoken: userData?.token }
      );
      setIsLoading(false);

      //console.log("resss", res.data);
      if (res.data.success) {
        setTrxHistory(res.data.data);
      } //else {
      //   toast({
      //     title: res.data.message,
      //     status: "warning",
      //     duration: 2000,
      //     isClosable: true,
      //   });
      // }
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

  function getLast10Objects(arr) {
    // Check if the array has fewer than 10 elements
    if (arr.length <= 5) {
      return arr;
    }

    // Use slice to extract the last 10 elements from the array
    const last10Objects = arr.slice(0, 5);

    return last10Objects;
  }

  useEffect(() => {
    getTransactions();
  }, []);

  const handlePlanChange = async () => {
    await getUserData(); // Refetch dashboard data
  };

  return (
    <DashboardLayout
      pageName="Dashboard"
      setDash_data={setUserData}
      setZero_contacts={setZero_contacts}
      payment_step={payment_step}
    >
      <PageLoader isLoading={isLoading} />
      <div className={styles.dashboard_top}>
        <div className={styles.dashboard_item}>
          <h4>Account Balance</h4>
          <h1>
            <FaNairaSign className={styles.icon} />
            {parseInt(info?.account_balance).toLocaleString("en-US", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
          <Text
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            fontFamily="inherit"
          >
            <span
              onClick={openModal1}
              style={{
                alignSelf: "flex-end",
                fontSize: "13px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fc1e65",
                padding: "4px",
                cursor: "pointer",
              }}
            >
              Fund Wallet{" "}
              <IoMdAddCircleOutline
                style={{ marginLeft: "8px", fontSize: "16px" }}
              />
            </span>
          </Text>
        </div>
        <div className={styles.dashboard_item}>
          <h4>Total Contacts</h4>
          <h1>{info?.totalContactCount}</h1>
        </div>
        <div className={styles.dashboard_item}>
          <div className="flex items-center font-poppins text-sm justify-between">
            <h4>Plan Information</h4>

            <button
              onClick={openModal}
              className="cursor-pointer text-pinks font-medium hover:text-pinks/70 duration-300 ease-in-out transition-all"
            >
              Switch plan
            </button>
          </div>
          <h1>{info?.plan_type}</h1>
          <Text
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            fontFamily="inherit"
          >
            {/* <PaystackButton > */}
            <span
              style={{
                alignSelf: "flex-end",
                fontSize: "13px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fc1e65",
                padding: "4px",
              }}
            >
              {<>{`${parseInt(info?.totalSmsCount)} sms remaining`}</>}
            </span>
            {/* </PaystackButton> */}
          </Text>
        </div>
      </div>
      <div className={styles.dashboard_middle}>
        <h3>Recent Transactions</h3>
        <TableContainer width={"100%"}>
          <Table size="md">
            <Thead>
              <Tr>
                <Th pl="0px">Payment Ref</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trxHistory.length === 0 ? (
                <div className="w-full items-center justify-center">
                  No transaction available at the moment
                </div>
              ) : (
                getLast10Objects(trxHistory).map((item, i) => {
                  return (
                    <Tr key={i}>
                      <Td pl="0px">{item?.paystack_trax_id}</Td>
                      <Td>{item?.amount_th}</Td>
                      <Td>
                        <Badge
                          variant="outline"
                          colorScheme={
                            item?.credit_type === "credit" ? "green" : "red"
                          }
                        >
                          {item?.credit_type === "credit" ? "Credit" : "Debit"}
                        </Badge>
                      </Td>
                      <Td>{item?.tranx_date}</Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </div>

      <AlertDialog
        isOpen={zero_contacts}
        leastDestructiveRef={cancelRef}
        onClose={() => setZero_contacts(false)}
        closeOnOverlayClick={false}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent width={modalWidth}>
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="300px"
            >
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right="-90%"
                top={-5}
                onClick={() => setZero_contacts(false)}
              />

              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Your Contact List is Empty!
              </AlertTitle>
              <AlertDescription maxWidth="sm" m="10px 0px">
                You need to upload your contacts through a csv or by typing to
                be able to send an sms!
              </AlertDescription>
              <Button
                onClick={() => navigate("/dashboard/contacts", { state: true })}
                mt="20px"
                colorScheme="blue"
              >
                Add Contacts
              </Button>
            </Alert>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <CustomModal isOpen={isOpen} onClose={closeModal1} title="Amount">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <div className="mt-4">
          <PaystackButton
            isDisabled={amount >= 100 ? false : true}
            amount={amount}
            isLoading={isLoading}
            callback={handleAccountFund}
            purpose="wallet_funding"
          />
        </div>
      </CustomModal>
      {/* switchplan modal */}
      <SwitchplanModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onPlanChange={handlePlanChange}
      />
    </DashboardLayout>
  );
}

export default Dashboard;
