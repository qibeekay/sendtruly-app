import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   Rectangle,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
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

function Dashboard() {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  const user_data = JSON.parse(localStorage.getItem("data_user_main"));
  const navigate = useNavigate();
  const toast = useToast();
  const [dash_data, setDash_data] = useState(
    JSON.parse(localStorage.getItem("dash_data")) || null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [payment_step, setPayment_step] = useState(0);
  const [amount, setAmount] = useState("");
  const [zero_contacts, setZero_contacts] = useState(false);
  const [trxHistory, setTrxHistory] = useState(
    JSON.parse(localStorage.getItem("user_trx")) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = React.useRef();

  const modalWidth = useBreakpointValue({ base: "90%", md: "50%" });

  // handle account funding
  const handleAccountFund = async (payload) => {
    const payment_data = { ...payload };
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
      const res = await AxiosInstance.post(
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
        { usertoken: user_data.usertoken }
      );
      setIsLoading(false);

      if (res.data.success) {
        setTrxHistory(res.data.data);
        localStorage.setItem("user_trx", JSON.stringify(res.data.data));
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
    if (dash_data) {
      if (parseInt(dash_data.total_contacts.data.contact_count) <= 0) {
        setZero_contacts(true);
      }
    }
    getTransactions();
  }, []);

  return (
    <DashboardLayout
      pageName="Dashboard"
      setDash_data={setDash_data}
      setZero_contacts={setZero_contacts}
      payment_step={payment_step}
    >
      <PageLoader isLoading={isLoading} />
      <div className={styles.dashboard_top}>
        <div className={styles.dashboard_item}>
          <h4>Account Balance</h4>
          <h1>
            {dash_data
              ? parseInt(
                  dash_data.account_balance.account_balance
                ).toLocaleString("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : ""}
            <FaNairaSign className={styles.icon} />
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
            {/* <PaystackButton > */}
            <span
              onClick={onOpen}
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
            {/* </PaystackButton> */}
          </Text>
        </div>
        <div className={styles.dashboard_item}>
          <h4>Total Contacts</h4>
          <h1>
            {dash_data ? dash_data.total_contacts.data.contact_count : ""}
          </h1>
        </div>
        <div className={styles.dashboard_item}>
          <h4>Plan Information</h4>
          <h1>{dash_data ? dash_data.plan_info : ""}</h1>
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
              {dash_data ? (
                <>
                  {parseInt(dash_data?.sms_count) <= 0
                    ? ""
                    : `${parseInt(
                        dash_data.sms_count.toLocaleString("en-US")
                      )} sms remaining`}
                </>
              ) : (
                ""
              )}
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
              {getLast10Objects(trxHistory).map((item, i) => {
                return (
                  <Tr key={i}>
                    <Td pl="0px">{item.paystack_trax_id}</Td>
                    <Td>{item.amount_th}</Td>
                    <Td>
                      <Badge
                        variant="outline"
                        colorScheme={
                          item.credit_type === "credit" ? "green" : "red"
                        }
                      >
                        {item.credit_type === "credit" ? "Credit" : "Debit"}
                      </Badge>
                    </Td>
                    <Td>{item.tranx_date}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </div>

      {/* <div className={styles.dashboard_middle}>
        <div className={styles.chart_1}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="pv"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="uv"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      
      </div> */}
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

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent width={modalWidth}>
          <ModalHeader>Amount</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="enter amount:"
            />
          </ModalBody>
          <ModalFooter>
            <PaystackButton
              isDisabled={amount >= 100 ? false : true}
              amount={amount}
              isLoading={isLoading}
              callback={handleAccountFund}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}

export default Dashboard;
