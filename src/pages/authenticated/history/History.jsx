import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layouts/dashboard/DashboardLayout";
import { AxiosInstance } from "../../../config";
import {
  Badge,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import PageLoader from "../../../components/loaders/PageLoader";

function History() {
  const toast = useToast();
  const [trxHistory, setTrxHistory] = useState(
    JSON.parse(localStorage.getItem("user_trx")) || []
  );
  const user_data = JSON.parse(localStorage.getItem("data_user_main"));
  const [isLoading, setIsLoading] = useState(false);

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
  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <DashboardLayout pageName={"History"}>
      <PageLoader isLoading={isLoading} />
      <Text mt="30px">All Transactions</Text>
      <TableContainer width={"100%"} mt="20px">
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
            {trxHistory.map((item, i) => {
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
    </DashboardLayout>
  );
}

export default History;
