import { Button } from "@chakra-ui/react";
import React from "react";
import { usePaystackPayment } from "react-paystack";

const userData = JSON.parse(localStorage.getItem("data_user_main"));

console.log("what", userData?.user?.mail);

const PaystackButton = ({ isDisabled, amount, isLoading, callback }) => {
  if (!amount) {
    return (
      <Button isDisabled={isDisabled} colorScheme="green" size="md">
        Pay
      </Button>
    );
  }
  const config = {
    reference: new Date().getTime().toString(),
    email: userData?.user?.mail,
    amount: parseInt(amount) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: import.meta.env.VITE_APP_PAYSTACK_KEY,
  };

  // you can call this function anything
  const onSuccess = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    return callback({
      status: true,
      usertoken: userData?.user?.usertoken,
      amount_paid: amount,
      paystack_ref: reference.reference,
    });
  };

  // you can call this function anything
  const onClose = () => {
    return callback({
      status: false,
      usertoken: userData?.user?.usertoken,
      amount_paid: amount,
    });
  };

  const initializePayment = usePaystackPayment(config);
  return (
    <Button
      onClick={() => {
        initializePayment(onSuccess, onClose);
      }}
      isLoading={isLoading}
      isDisabled={isDisabled}
      colorScheme="green"
      size="md"
    >
      Proceed to payment
    </Button>
  );
};

export default PaystackButton;
