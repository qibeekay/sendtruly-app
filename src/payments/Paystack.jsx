import { Button } from "@chakra-ui/react";
import React from "react";
import { usePaystackPayment } from "react-paystack";

const userData = JSON.parse(localStorage.getItem("data_user_main"));

const PaystackButton = ({
  isDisabled,
  amount,
  isLoading,
  callback,
  purpose,
  fixedAmount,
  customButton,
}) => {
  const paymentAmount = fixedAmount !== undefined ? fixedAmount : amount;

  if (!paymentAmount && !fixedAmount) {
    return (
      <Button isDisabled={isDisabled} colorScheme="green" size="md">
        Pay
      </Button>
    );
  }

  const config = {
    reference: new Date().getTime().toString(),
    email: userData?.user?.mail,
    amount: parseInt(paymentAmount) * 100,
    publicKey: import.meta.env.VITE_APP_PAYSTACK_KEY,
    metadata: {
      purpose: purpose || "wallet_funding",
      name: `${userData?.user?.fname} ${userData?.user?.lname}`,
    },
  };

  const onSuccess = (reference) => {
    return callback({
      status: true,
      usertoken: userData?.user?.usertoken,
      amount_paid: paymentAmount,
      paystack_ref: reference.reference,
      purpose: purpose,
    });
  };

  const onClose = () => {
    return callback({
      status: false,
      usertoken: userData?.user?.usertoken,
      amount_paid: paymentAmount,
      purpose: purpose,
    });
  };

  const initializePayment = usePaystackPayment(config);

  if (customButton) {
    return React.cloneElement(customButton, {
      onClick: () => initializePayment(onSuccess, onClose),
      disabled: isDisabled || isLoading,
    });
  }

  return (
    <Button
      onClick={() => initializePayment(onSuccess, onClose)}
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
