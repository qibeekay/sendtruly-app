import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ActivatePayment, InvoiceRedirect } from "../../../api/text2pay";
import PageLoader from "../../../components/loaders/PageLoader";
import { useToast } from "@chakra-ui/react";

const TextTwopay = () => {
  const { token } = useParams(); // Extract reviewId from the route
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [invoice, setInvoice] = useState({});
  const number = searchParams.get("t");
  const email = searchParams.get("e");

  const toast = useToast();

  const [formdata, setFormData] = useState({
    amount: "",
    currency: "NGN",
    email: "",
    name: "",
    user_id: 0,
    token: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch invoice data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await InvoiceRedirect(token, number, email);
      setInvoice(result.data[0]);
      setLoading(false);
    };
    fetchData();
  }, [token, number, email]);

  // Update formdata when invoice is fetched
  useEffect(() => {
    if (invoice?.invoice) {
      setFormData((prev) => ({
        ...prev,
        amount: invoice.invoice.total_price,
        user_id: invoice.invoice.user_id,
        token: invoice.invoice.token, // Assuming token should be user_id
      }));
    }
  }, [invoice]);

  // Function to submit payment activation
  const activate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await ActivatePayment(formdata);

    toast({
      title: result.success ? "Success!" : "Error occurred",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 5000,
      isClosable: true,
    });

    //console.log("resultssss", result);

    setIsLoading(false);

    // Redirect to payment link if activation is successful
    if (result.success && result.data?.payment_link) {
      window.location.href = result.data.payment_link; // Redirect to the payment link
    }
  };

  return (
    <div>
      <PageLoader isLoading={loading} />
      <div className="max-w-[500px] bg-white min-h-screen mx-auto p-4 w-full flex items-center justify-center">
        <div className="w-full flex flex-col gap-7">
          <h1 className="text-center font-bold">{invoice?.invoice?.title}</h1>
          <div className="border border-black/25 w-full flex justify-between items-center">
            <div className="w-full p-5">
              {invoice?.items?.map((item) => (
                <p className="font-semibold" key={item?.id}>
                  {item?.goods}
                </p>
              ))}
            </div>
            <div className="min-w-[135px] min-h-[95px] border border-black/25 h-full flex flex-col items-center justify-center bg-black/25 p-3">
              <p>Total to pay</p>
              <p>NGN{invoice?.invoice?.total_price}</p>
            </div>
          </div>
          <form className="w-full flex flex-col gap-5 p-5 border border-black/25">
            <h1 className="font-bold">1. Customer information</h1>

            <div className=" flex flex-col gap-5">
              {/* name */}
              <div>
                <label htmlFor="">Name</label>
                <div className="mt-1">
                  <input
                    name="name"
                    value={formdata.name}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-black/25 p-2"
                    type="text"
                  />
                </div>
              </div>

              {/* email */}
              <div>
                <label htmlFor="">Email</label>
                <div className="mt-1">
                  <input
                    name="email"
                    value={formdata.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-black/25 p-2"
                    type="text"
                  />
                </div>
              </div>

              {/* button */}
              <div>
                <button
                  onClick={activate}
                  className="w-full p-2 bg-black text-white font-bold"
                >
                  {isLoading ? "Loading..." : "Pay Now"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TextTwopay;
