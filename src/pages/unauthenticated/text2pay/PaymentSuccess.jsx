import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import PageLoader from "../../../components/loaders/PageLoader";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const trxref = searchParams.get("trxref");
  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://v2.sendtruly.com/v0.1/api/payment/verify-invoice-payment?user_id=2&trxref=${trxref}&reference=${reference}`
        );
        const data = await response.json();

        if (data.success) {
          setPaymentStatus("success");
          toast({
            title: "Payment Successful",
            description: "Your transaction has been verified successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          setPaymentStatus("failed");
          toast({
            title: "Payment Failed",
            description: "Transaction verification failed. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        setPaymentStatus("error");
        toast({
          title: "Error",
          description: "An error occurred while verifying the payment.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setLoading(false);
    };

    if (trxref && reference) {
      verifyPayment();
    }
  }, [trxref, reference, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <PageLoader isLoading={loading} />
      {!loading && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          {paymentStatus === "success" ? (
            <>
              <h2 className="text-green-600 text-2xl font-bold">
                Payment Successful
              </h2>
              <p className="text-gray-700 mt-2">
                Your transaction with reference <b>{reference}</b> was
                successful.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-red-600 text-2xl font-bold">
                Payment Failed
              </h2>
              <p className="text-gray-700 mt-2">
                We couldn't verify your payment. Please try again or contact
                support.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
